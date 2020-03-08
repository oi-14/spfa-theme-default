// Copyright (C) 2020  李嘉嵘
//
// This file is a part of spfa-theme-default.
//
// spfa-theme-default is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// spfa-theme-default is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with spfa-theme-default.  If not, see <https://www.gnu.org/licenses/>.

////////////////////////////////////////////////////////////////////////

var files = require("spfa-files");
var md2html = require("./md2html");
var mkindex = require("./mkindex");
var yaml = require("spfa-yaml");

module.exports.gen = function DFGenerate(path) {
    var config = yaml.read(__dirname + "/config.yaml");
    var codeTheme;
    try {
        codeTheme = config["code-theme"] ? config["code-theme"] : "dark";
    } catch (error) {
        console.log("Detected error in config.yaml");
        console.log("Please check the configuration of config.yaml");
        console.log("Using default code-theme (dark)");
        console.log("If you want to get a full list of code themes, please read the originl config.yaml");
        codeTheme = "dark";
    }
    try {
        files.cpdir(__dirname + "/lib", path + "/public/lib");
    } catch (error) {
        console.error(error.toString());
    }
    files.mkdir(path + "/public");
    files.mkdir(path + "/public/post");
    files.mkdir(path + "/public/lib");

    var postdir = path + "/post";
    var list = files.ls(postdir, ".md");
    var dirLis_ = files.ls(postdir, "");
    var dirLis = [];
    for (let i = 0; i < dirLis_.length; i++) {
        var dirPath = postdir + "/" + dirLis_[i];
        if (files.isDirectory(dirPath)) {
            dirLis.push(dirLis_[i]);
        }
    }

    for (let i = 0; i < list.length; i++) {
        var item = list[i];
        var name = item.replace(".md", "");
        files.mkdir(path + "/public/post/" + name);
        if (dirLis.includes(name)) {
            files.cpdir(postdir + "/" + name, path + "/public/post/" + name);
        }
        md2html.md2html(
            path + "/post/" + item,
            path + "/public/post/" + name + "/index.html",
            codeTheme
        );
    }

    mkindex.mkindex(path + "/public/index.html", path + "/public/post");
    console.log("generating /public/index.html");
};