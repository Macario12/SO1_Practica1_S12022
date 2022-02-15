import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CalculateIcon from '@mui/icons-material/Calculate';
import TableChartIcon from '@mui/icons-material/TableChart';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [signo, setSigno] = React.useState('suma');

  const [num1, setNum1] = React.useState(0);
  const [num2, setNum2] = React.useState(0);

  const [resultado, setResultado] = React.useState(0);
  const [respuesta, setRespuesta] = React.useState("");

  function operarResultado() {
    let jsonCodigo = JSON.stringify({numero1:num1,numero2:num2,signo:signo,resultado:0})
    console.log(jsonCodigo)
  
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonCodigo
    };
    fetch('http://localhost:4200/operar', requestOptions)
        .then(response => response.json())
        .then(data => setRespuesta(data))
  
        setResultado(respuesta.Resultado)
  }
  


  
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const selectsigno = (event, newValue) => {
    setSigno(event.target.value);
  };

  const inputNumero1 = (event, newValue) => {
    setNum1(event.target.value);
  };

  const inputNumero2 = (event, newValue) => {
    setNum2(event.target.value);
  };

  const opera = (event, newValue) => {
    operarResultado()
    console.log(num1+num2)
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Tabs value={value} onChange={handleChange} aria-label="icon tabs example"centered>
      <Tab icon={<CalculateIcon />} aria-label="calculate">
      
      </Tab>
      <Tab icon={<TableChartIcon />} aria-label="table" />
    </Tabs> 
    <TabPanel value={value} index={0}>
    <Typography variant="h3" mt={6} sx={{ mx: "auto", width:250 }}>Calculadora</Typography>
       <Box
       mt={6}
       component="form"
       sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' },mx: "auto", width:250 }}
       
       noValidate
       autoComplete="off"
       >
       <div>
       <TextField
          id="outlined-password-input"
          label="Numero 1"
          autoComplete="current-password"
          value={num1}
          onChange={inputNumero1}
        />
       </div>
       <div>
       <TextField
          id="outlined-password-input"
          label="Numero 2"
          autoComplete="current-password"
          value={num2}
          onChange={inputNumero2}
        />
       </div>

        <div>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Signo</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={signo}
              label="value"
              onChange={selectsigno}
            >
              <MenuItem value={0}>+</MenuItem>
              <MenuItem value={1}>-</MenuItem>
              <MenuItem value={2}>*</MenuItem>
              <MenuItem value={3}>/</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div>
        <Button variant="outlined"  size="large" onClick={opera}>Operar</Button>
        </div>
        <div>
        <Alert severity="success">
          <AlertTitle>Resultado</AlertTitle>
          —- <strong>{resultado}</strong>
        </Alert>
        </div>
       </Box>
    </TabPanel>



    <TabPanel value={value} index={1}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </TabPanel>

    </ThemeProvider>
  );
}