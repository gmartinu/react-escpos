"use strict";
/**
 * Core type definitions for thermal printer libraries
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardElementType = void 0;
/**
 * Standard element types that can be converted to printer commands.
 * All adapters must normalize their component types to these standard types.
 */
var StandardElementType;
(function (StandardElementType) {
    StandardElementType["DOCUMENT"] = "document";
    StandardElementType["PAGE"] = "page";
    StandardElementType["VIEW"] = "view";
    StandardElementType["TEXT"] = "text";
    StandardElementType["IMAGE"] = "image";
    StandardElementType["TEXTNODE"] = "textnode";
})(StandardElementType || (exports.StandardElementType = StandardElementType = {}));
