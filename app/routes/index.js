var express = require("express");
var fastcsv = require("fast-csv");
var router = express.Router();
var fs = require("fs");
var mongoose = require("mongoose");
var Motorcycle = mongoose.model("Motorcycle");
var csvfile = __dirname + "/../public/files/MotorcycleData.csv";
var stream = fs.createReadStream(csvfile);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Importando arquivo CSV usando NodeJS." });
});

router.get("/csv", function (req, res, next) {
  var csvStream = fastcsv
    .parse()
    .on("data", function (data) {
      var item = new Motorcycle({
        condition: data[0],
        condition_desc: data[1],
        price: data[3],
        location: data[4],
        model_year: data[5],
        exterior_color: data[7],
        make: data[8],
        warranty: data[9],
        model: data[10],
        sub_model: data[11],
        type: data[12],
      });
      item.save(function (error) {
        if (error) {
          res.status(400).json({ title: error });
          throw error;
        }
      });
    })
    .on("end", function () {
      res.status(200).json({ title: "Os dados foram importados com sucesso." });
    });
  stream.pipe(csvStream);
});

router.get("/motorcycle", async function (req, res, next) {
  const motorcycle = await Motorcycle.find({});
  if (motorcycle.length !== 0) {   
    let newList = []; 
    motorcycle.forEach(e => {
      newList.push({...e._doc, id: e._id});
    });
    return res.status(200).json(newList);
  }
  return res
    .status(404)
    .json({ message: "Não existe nenhum registro no banco" });
});

router.get("/motorcycle/:id", async function (req, res, next) {
  const { id } = req.params;
  const motorcycle = await Motorcycle.findById({ _id: id });
  if (motorcycle) {
    return res.status(200).json(motorcycle);
  }
  return res
    .status(404)
    .json({ message: "Não existe nenhum registro no banco" });
});

router.put("/motorcycle/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    await Motorcycle.updateOne({ _id: id }, { $set: req.body });
    res.status(201).json({ title: "Atualizado com Sucesso !!!" });
  } catch (error) {
    res.status(400).json({ title: error });
  }
});

router.delete("/motorcycle/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    await Motorcycle.findByIdAndDelete({ _id: id });
    res.status(201).json({ title: "Deletado com Sucesso !!!" });
  } catch (error) {
    res.status(400).json({ title: error });
  }
});

router.post("/motorcycle/", async function (req, res, next) {
  try {
    await Motorcycle.create(req.body);
    res.status(201).json({ title: "Criado com Sucesso !!!" });
  } catch (error) {
    res.status(400).json({ title: error });
  }
});
module.exports = router;
