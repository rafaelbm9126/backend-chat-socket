"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.DATABASE_URL || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose_1.default.set("useCreateIndex", true);
mongoose_1.default.set("useFindAndModify", false);
exports.default = mongoose_1.default;
