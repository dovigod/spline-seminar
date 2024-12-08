import "./style.css";
import VanillaJSRouter from "@daleighan/vanilla-js-router";
import { Component as CatmullRom } from "./CatmullRom";
import { Component as CatmullRom3d } from "./CatmullRom3d";
const Home = "<div>Home</div>";
const routes = {
  "/": Home,
  "/catmull-rom": CatmullRom,
  "/catmull-rom-3d": CatmullRom3d,
};

const router = new VanillaJSRouter("base", routes);
