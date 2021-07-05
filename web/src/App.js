import _ from "lodash";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import ReactAudioPlayer from "react-audio-player";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import ReactPlayer from "react-player";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import React, { useEffect, useState } from "react";

const urlNuvem = "https://backendn3.herokuapp.com";
const urlLocal = "http://localhost:3000";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

export default function FullWidthGrid() {
  const [list, setList] = useState([]);
  const [tmpList, setTmpList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  //FORM
  const [conditionDesc, setConditionDesc] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [modelYear, setModelYear] = useState("");
  const [exteriorColor, setExteriorColor] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [subModel, setSubModel] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);

  const [disableDelete, setDisableDelete] = useState(true);

  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  async function getMotorcycle() {
    await axios
      .get(`${urlNuvem}/motorcycle/`, {})
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          setList(response.data);
        }
      })
      .catch(function (error) {
        if (error) {
          alert(
            "Algo deu errado tente novamente."
          );
        }
      });
  }

  useEffect(() => {
    getMotorcycle();
  }, []);

  async function handleEditOrDelete(item) {
    let newList = _.filter(tmpList, { _id: item.id });

    if (newList.length === 0) {
      setTmpList(_.concat(tmpList, [item]));
    } else {
      let newList2 = _.filter(tmpList, { _id: item.id });
      setTmpList(_.reject(tmpList, { id: newList2[0].id }));
    }
  }

  useEffect(() => {
    console.log("tmpList", tmpList);
    if (tmpList.length !== 0) {
      setDisableDelete(false);
    } else {
      setDisableDelete(true);
    }
  }, [tmpList]);

  async function handleLoadingCSV() {
    setLoading(true);
    await axios
      .get(`${urlNuvem}/csv/`, {})
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          getMotorcycle();
        }
      })
      .catch(function (error) {
        if (error) {
          alert(
            "Algo deu errado tente novamente."
          );
        }
      });
  }

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const columns = [
    {
      field: "condition_desc",
      headerName: "Descrição da condição",
      width: 190,
    },
    { field: "price", headerName: "Preço", width: 100 },
    { field: "location", headerName: "Localização", width: 160 },
    { field: "model_year", headerName: "Ano", width: 100 },
    { field: "exterior_color", headerName: "Cor", width: 100 },
    { field: "make", headerName: "Marca", width: 160 },
    { field: "model", headerName: "Modelo", width: 160 },
    { field: "sub_model", headerName: "Submodelo", width: 160 },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setLoadingSave(true);
    await axios
      .post(`${urlNuvem}/motorcycle/`, {
        condition_desc: conditionDesc,
        price,
        location,
        model_year: modelYear,
        exterior_color: exteriorColor,
        make,
        model,
        sub_model: subModel,
      })
      .then(function (response) {
        setLoadingSave(false);
        alert("Aviso !!! Tarefa cadastrada com Sucesso !!!");
        setConditionDesc("");
        setPrice("");
        setLocation("");
        setModelYear("");
        setExteriorColor("");
        setMake("");
        setModel("");
        setSubModel("");
        getMotorcycle();
      })
      .catch(function (error) {
        setLoadingSave(false);
        if (!error.response) {
          alert("Problema com API");
        } else {
          if (error.response.status === 400) {
            error.response.data.errs.forEach((erro) => {
              alert(erro);
            });
          }
        }
      });
  }

  async function handleDelete() {
    tmpList.forEach((e) => {
      console.log("e", e);
    });
  }

  return (
    <div className={classes.root}>
      <Dialog onClose={handleClose} open={open}>
        <form onSubmit={handleSubmit}>
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Novo
          </DialogTitle>
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  style={{ width: "100%" }}
                  id="conditionDesc"
                  required
                  value={conditionDesc}
                  onChange={(e) => setConditionDesc(e.target.value)}
                  label="Descrição da condição"
                  variant="filled"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  style={{ width: "100%" }}
                  label="Preço"
                  variant="filled"
                  id="price"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  style={{ width: "100%" }}
                  id="location"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  label="Localização"
                  variant="filled"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  style={{ width: "100%" }}
                  id="modelYear"
                  required
                  value={modelYear}
                  onChange={(e) => setModelYear(e.target.value)}
                  label="Ano"
                  variant="filled"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  style={{ width: "100%" }}
                  id="exteriorColor"
                  required
                  value={exteriorColor}
                  onChange={(e) => setExteriorColor(e.target.value)}
                  label="Cor"
                  variant="filled"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  style={{ width: "100%" }}
                  id="make"
                  required
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  label="Marca"
                  variant="filled"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  style={{ width: "100%" }}
                  id="model"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  label="Modelo"
                  variant="filled"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  style={{ width: "100%" }}
                  id="subModel"
                  required
                  value={subModel}
                  onChange={(e) => setSubModel(e.target.value)}
                  label="Submodelo"
                  variant="filled"
                />
              </Grid>
            </Grid>
          </Container>
          {loadingSave === false ? (
            <DialogActions>
              <Button type="submit" color="primary">
                Salvar
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <CircularProgress color="secondary" />
            </DialogActions>
          )}
        </form>
      </Dialog>
      <br />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="h2" component="h2">
              N3 Linguagem de programacao 3
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              style={{ width: "90%" }}
              variant="contained"
              color="secondary"
              onClick={() => handleLoadingCSV()}
            >
              Carregar CSV
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              style={{ width: "90%" }}
              variant="contained"
              color= "secondary"
              onClick={handleClickOpen}
            >
              ADICIONAR
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              disabled={true}
              style={{ width: "90%" }}
              variant="contained"
              color= "secondary"
            >
              Editar
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              disabled={disableDelete}
              style={{ width: "90%" }}
              variant="contained"
              color= "secondary"
              onClick={() => handleDelete()}
            >
              Deletar
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}></Grid>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                loading={loading}
                rows={list}
                columns={columns}
                pageSize={5}
                checkboxSelection
                onRowSelected={(e) => handleEditOrDelete(e.data)}
                autoHeight
              />
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
