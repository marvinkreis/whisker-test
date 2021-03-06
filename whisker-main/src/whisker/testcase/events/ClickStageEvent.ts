/*
 * Copyright (C) 2020 Whisker contributors
 *
 * This file is part of the Whisker test generator for Scratch.
 *
 * Whisker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Whisker is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Whisker. If not, see http://www.gnu.org/licenses/.
 *
 */

import VirtualMachine from 'scratch-vm/src/virtual-machine.js';
import {ScratchEvent} from "../ScratchEvent";
import {Container} from "../../utils/Container";

export class ClickStageEvent implements ScratchEvent {

    private readonly _target: string;

    constructor(target: string) {
        this._target = target;
    }

    async apply(vm: VirtualMachine): Promise<void> {
        // TODO: Is there a better solution than simply activating the hats?
        // TODO: Find an empty spot to click on to click the stage?
        Container.testDriver.clickStage();
    }

    public toJavaScript(args: number[]): string {
        return 't.clickStage()';
    }

    public toString(args: number[]): string {
        return "ClickStage"
    }

    getNumParameters(): number {
        return 0;
    }
}
