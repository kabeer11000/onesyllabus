"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("@/database/index");
var ocr_1 = require("../../../api/mlkit/ocr");
var uuid_1 = require("uuid");
var index_2 = require("./index");
var WorkerAPI = /** @class */ (function () {
    function WorkerAPI() {
    }
    WorkerAPI.prototype.co = function () {
        return ["jerkoff"];
    };
    WorkerAPI.prototype.indexContent = function (scraper, _a) {
        var _b, _c, _d, _e, _f, _g;
        var year = _a.year, topic = _a.topic, group = _a.group, cat = _a.cat, appearance = _a.appearance;
        return __awaiter(this, void 0, void 0, function () {
            var db, files, indexedInThisYear, _loop_1, _i, files_1, file;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, index_1.MongoDB];
                    case 1:
                        db = _h.sent();
                        return [4 /*yield*/, scraper.GetContent(year["@upstream"]["@attach"])];
                    case 2:
                        files = _h.sent();
                        return [4 /*yield*/, db.collection("documents").find({
                            year: year.id,
                            group: group,
                            cat: cat,
                            appearance: appearance ? appearance.id : null,
                            topic: topic,
                        }).toArray()];
                    case 3:
                        indexedInThisYear = _h.sent();
                        console.log("files found: ", files.length);
                        _loop_1 = function (file) {
                            var exists, _j, pages, total, documentType, _k, _l, documentSession, _m, _o, document, _p, _q, insert_ids;
                            return __generator(this, function (_r) {
                                switch (_r.label) {
                                    case 0:
                                        exists = indexedInThisYear.find(function (i) { return i.file.location === file.file.location; });
                                        if (exists) {
                                            console.log("skipping file: ", exists.file.name);
                                            return [2 /*return*/, "continue"];
                                        }
                                        return [4 /*yield*/, ocr_1.default.RecognizePDF({ pdf: file.file.location, getImages: false })];
                                    case 1:
                                        _j = _r.sent(), pages = _j.pages, total = _j.total;
                                        return [4 /*yield*/, db.collection('category-document-type')];
                                    case 2: return [4 /*yield*/, (_r.sent()).findOne({
                                        cat: cat,
                                        appearance: appearance === null || appearance === void 0 ? void 0 : appearance.id,
                                        alias: { $in: [(_b = file["@meta"]["inferred"]["resource"]["document-type"]) === null || _b === void 0 ? void 0 : _b.toUpperCase()] }
                                    })];
                                    case 3:
                                        if (!((_c = _r.sent()) !== null && _c !== void 0)) return [3 /*break*/, 4];
                                        _k = _c;
                                        return [3 /*break*/, 7];
                                    case 4:
                                        _l = index_2.insertReturn;
                                        return [4 /*yield*/, db.collection('category-document-type')];
                                    case 5: return [4 /*yield*/, _l.apply(void 0, [_r.sent(), {
                                        cat: cat,
                                        id: (0, uuid_1.v4)(),
                                        appearance: appearance ? appearance.id : null,
                                        alias: [(_d = file["@meta"]["inferred"]["resource"]["document-type"]) === null || _d === void 0 ? void 0 : _d.toUpperCase()]
                                    }])];
                                    case 6:
                                        _k = (_r.sent());
                                        _r.label = 7;
                                    case 7:
                                        documentType = _k;
                                        return [4 /*yield*/, db.collection('category-sessions')];
                                    case 8: return [4 /*yield*/, (_r.sent()).findOne({
                                        cat: cat,
                                        appearance: appearance ? appearance.id : null,
                                        alias: { $in: [(_e = file["@meta"]["inferred"]["resource"]["session"]) === null || _e === void 0 ? void 0 : _e.toUpperCase()] }
                                    })];
                                    case 9:
                                        if (!((_f = _r.sent()) !== null && _f !== void 0)) return [3 /*break*/, 10];
                                        _m = _f;
                                        return [3 /*break*/, 13];
                                    case 10:
                                        _o = index_2.insertReturn;
                                        return [4 /*yield*/, db.collection('category-sessions')];
                                    case 11: return [4 /*yield*/, _o.apply(void 0, [_r.sent(), {
                                        cat: cat,
                                        id: (0, uuid_1.v4)(),
                                        appearance: appearance,
                                        alias: [(_g = file["@meta"]["inferred"]["resource"]["session"]) === null || _g === void 0 ? void 0 : _g.toUpperCase()]
                                    }])];
                                    case 12:
                                        _m = (_r.sent());
                                        _r.label = 13;
                                    case 13:
                                        documentSession = _m;
                                        if (!(exists !== null && exists !== void 0)) return [3 /*break*/, 14];
                                        _p = exists;
                                        return [3 /*break*/, 17];
                                    case 14:
                                        _q = index_2.insertReturn;
                                        return [4 /*yield*/, db.collection('documents')];
                                    case 15: return [4 /*yield*/, _q.apply(void 0, [_r.sent(), {
                                        "id": (0, uuid_1.v4)(),
                                        "tags": file["@meta"]["tags"] || [],
                                        group: group,
                                        "cat": cat,
                                        appearance: appearance,
                                        "topic": topic,
                                        // "year": year,
                                        year: year.id,
                                        _year_name_tmp: year.name,
                                        "resource": {
                                            "document-type": documentType.id,
                                            "paper": file["@meta"]["inferred"]["paper_number"],
                                            "year": file["@meta"]['inferred']["year"],
                                            "variant": file["@meta"]["inferred"]["variant_number"],
                                            "session": documentSession.id,
                                        },
                                        "@meta": {
                                            "page-count": total,
                                            "timestamp": Date.now(),
                                        },
                                        "file": {
                                            "location": file["file"].location,
                                            "name": file["file"].name,
                                        }
                                    }])];
                                    case 16:
                                        _p = (_r.sent());
                                        _r.label = 17;
                                    case 17:
                                        document = _p;
                                        return [4 /*yield*/, db.collection('document-pages').insertMany(pages.map(function (_a) {
                                            var index = _a.index, text = _a.text, image = _a.image;
                                            return ({
                                                "text": text,
                                                "id": (0, uuid_1.v4)(),
                                                topic: topic,
                                                cat: cat,
                                                group: group,
                                                appearance: appearance,
                                                year: year.id,
                                                "@meta": {
                                                    "ocr": "kn.mlkit.ocr.tesseract",
                                                    "timestamp": Date.now()
                                                },
                                                "image": {
                                                    // "hosted": `https://docs.kabeercloud.tk/static/papers/screenshots/${pageId}.png`
                                                },
                                                "pdf": document.id,
                                                "index": index
                                            });
                                        }))];
                                    case 18:
                                        insert_ids = _r.sent();
                                        console.log("inserted ", pages.length, " pages, ids: ", insert_ids);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, files_1 = files;
                        _h.label = 4;
                    case 4:
                        if (!(_i < files_1.length)) return [3 /*break*/, 7];
                        file = files_1[_i];
                        return [5 /*yield**/, _loop_1(file)];
                    case 5:
                        _h.sent();
                        _h.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return WorkerAPI;
}());
exports.default = WorkerAPI;
