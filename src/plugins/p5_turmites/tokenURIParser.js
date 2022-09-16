import { parse as tparse } from "svg-parser"

var getTurmiteData = function (uriData) {
  var turmiteData = {
    board: uriData["attributes"][0]["value"],
    //change x and y ?
    posx: parseInt(uriData["attributes"][3]["value"]),
    posy: parseInt(uriData["attributes"][4]["value"]),
    rule: uriData["attributes"][1]["value"],
    state: parseInt(uriData["attributes"][2]["value"]),
    direction: parseInt(uriData["attributes"][5]["value"]),
    //direction: 1,
  };
  return turmiteData;
};

const decodeUri = (decodedJson) => {
  const metaWithoutDataURL = decodedJson.substring(
    decodedJson.indexOf(",") + 1
  );
  let buff = Buffer.from(metaWithoutDataURL, "base64");
  let text = buff.toString("ascii");
  return text;
};

var parseBMPFromJson = function (uriData) {
  var image1 = uriData["image"];
  var svgParsed = decodeUri(image1);
  const parsed = tparse.parse(svgParsed);
  //console.log(parsed);
  const base64Image = parsed.children[0].children[0].properties[
    "xlink:href"
  ].split(",", 2)[1];
  var buf = Buffer.from(base64Image, "base64");
  //var withoutheader = buf.slice(21814 - 20736);
  var withoutheader = buf.slice(buf.length - 20736);
  return withoutheader;
};

var parseBMPFromBoard = function (uriBoardData) {
  var buf = Buffer.from(uriBoardData.slice(2), "hex");
  //var withoutheader = buf.slice(21814 - 20736);
  var withoutheader = buf.slice(buf.length - 20736);
  return withoutheader;
};

export default {
  turmiteParser: function (uriData) {
    var decodeJSON = decodeUri(uriData);
    var uriData = JSON.parse(decodeJSON);
    var turmiteData = getTurmiteData(uriData);
    return turmiteData;
  },
  turmiteBMPParser: function (uriData) {
    var decodeJSON = decodeUri(uriData);
    var uriData = JSON.parse(decodeJSON);
    var turmiteData = parseBMPFromJson(uriData);
    return turmiteData;
  },
  boardParser: function (BMPData) {
    var boardData = parseBMPFromBoard(BMPData);
    return boardData;
  },
};