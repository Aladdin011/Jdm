"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const typeorm_1 = require("typeorm");
let Project = class Project {
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100
    }),
    __metadata("design:type", String)
], Project.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text'
    }),
    __metadata("design:type", String)
], Project.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50
    }),
    __metadata("design:type", String)
], Project.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100
    }),
    __metadata("design:type", String)
], Project.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true
    }),
    __metadata("design:type", Number)
], Project.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'date',
        nullable: true
    }),
    __metadata("design:type", Date)
], Project.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'date',
        nullable: true
    }),
    __metadata("design:type", Date)
], Project.prototype, "estimatedEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-json',
        nullable: true
    }),
    __metadata("design:type", Array)
], Project.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-array',
        nullable: true
    }),
    __metadata("design:type", Array)
], Project.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'pending'
    }),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0
    }),
    __metadata("design:type", Number)
], Project.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true
    }),
    __metadata("design:type", String)
], Project.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'medium'
    }),
    __metadata("design:type", String)
], Project.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true
    }),
    __metadata("design:type", String)
], Project.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true
    }),
    __metadata("design:type", String)
], Project.prototype, "manager", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0
    }),
    __metadata("design:type", Number)
], Project.prototype, "spent", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: false
    }),
    __metadata("design:type", Boolean)
], Project.prototype, "public", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Entity)('projects')
], Project);
//# sourceMappingURL=Project.js.map