﻿import { expect } from 'chai';
import mcData from '../../tools/minecraft/storage';

describe("Minecraft data storage", () => {
    describe("death counter", () => {
        describe("shot by a [entity]", () => {
            it("skeleton", () => {
                mcData.processLine("2017-02-17 22:20:21 [INFO] tjaing3521 was shot by Skeleton");
                expect(mcData.getDeathsFor("tjaing3521").entries).to.equal(1);
                expect(mcData.getDeathsFor("tjaing3521")).to.eql(["was shot by Skeleton"]);
            });
        });
    });
});