"use strict";

import * as vscode from "vscode";


// variables have a few possible first characters - use these to identify vars vs. rules
export const varFirstChar: Set<string> = new Set(["$", "#", "@", "!"]);

/*
    Get the start and end boundaries for the current YARA rule based on a symbol's position
*/
export function GetRuleRange(lines: string[], symbol: vscode.Position) {
    let begin: vscode.Position | null = null;
    let end: vscode.Position | null = null;
    const startRuleRegexp = RegExp("^rule ");
    const endRuleRegexp = RegExp("^\}");
    // find the nearest reference to "rule" by traversing the lines in reverse order
    for (let lineNo = symbol.line; lineNo >= 0; lineNo--) {
        if (startRuleRegexp.test(lines[lineNo])) {
            begin = new vscode.Position(lineNo, 0);
            break;
        }
    }
    // start up this loop again using the beginning of the rule
    // and find the line with just a curly brace to identify the end of a rule
    for (let lineNo = begin.line; lineNo < lines.length; lineNo++) {
        if (endRuleRegexp.test(lines[lineNo])) {
            end = new vscode.Position(lineNo, 0);
            break;
        }
    }
    return new vscode.Range(begin, end);
}