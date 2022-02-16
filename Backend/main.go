package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type Operacion struct {
	Numero1   int    `json:"numero1"`
	Numero2   int    `json:"numero2"`
	Signo     int    `json:"signo"`
	Resultado int    `json:"resultado"`
	Fecha     string `json:"Fecha"`
}

var usersCollection *mongo.Collection

func inicial(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Funcionan EDD")
}

func operar(w http.ResponseWriter, r *http.Request) {
	//objeto tipo Operacion para recibir el Json

	var req Operacion

	reqBody, err := ioutil.ReadAll(r.Body)

	//validacion si la peticion retorna error
	if err != nil {
		fmt.Fprintf(w, "Error al enviar")
	}
	(w).Header().Set("Access-Control-Allow-Origin", "*")
	(w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	//obtenemos el json
	json.Unmarshal(reqBody, &req)

	//declaracion de variable tipo int para devolver el resultado
	resultado := 0

	//validaciones para el tipo de signo que retorna

	/*
		0 = suma
		1 = resta
		2 = multiplicacion
		3 = division
	*/

	if req.Signo == 0 {
		resultado = req.Numero1 + req.Numero2
	}

	if req.Signo == 1 {
		resultado = req.Numero1 - req.Numero2
	}

	if req.Signo == 2 {
		resultado = req.Numero1 * req.Numero2
	}

	if req.Signo == 3 {
		resultado = req.Numero1 / req.Numero2
	}

	//Fecha
	t := time.Now()
	fecha := fmt.Sprintf("%d-%02d-%02dT%02d:%02d:%02d",
		t.Year(), t.Month(), t.Day(),
		t.Hour(), t.Minute(), t.Second())

	req.Fecha = fecha

	req.Resultado = resultado
	// Se inserta en la base de datos
	result, err := usersCollection.InsertOne(context.TODO(), req)
	// check for errors in the insertion
	if err != nil {
		panic(err)
	}
	fmt.Println(result.InsertedID)
	//se devuelve el valor para el front
	//fmt.Println("Resultado:", resultado)

	json.NewEncoder(w).Encode(req)
}

func getAll(w http.ResponseWriter, r *http.Request) {
	cursor, err := usersCollection.Find(context.TODO(), bson.D{})
	// check for errors in the finding
	if err != nil {
		panic(err)
	}
	var results []bson.M
	// check for errors in the conversion
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}
	fmt.Println(results)
	(w).Header().Set("Access-Control-Allow-Origin", "*")
	(w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(results)
}

func main() {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://mongoadmin:123@192.168.0.12:27017"))
	if err != nil {
		panic(err)
	}

	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}

	usersCollection = client.Database("testing").Collection("users")

	router := mux.NewRouter()
	router.HandleFunc("/", inicial).Methods("GET")
	router.HandleFunc("/getAll", getAll).Methods("GET", "OPTIONS")
	//metodo post para la operacion
	router.HandleFunc("/operar", operar).Methods("POST", "OPTIONS")
	//puerto en el que corrre el Servidor.
	log.Fatal(http.ListenAndServe(":4200", router))
}
