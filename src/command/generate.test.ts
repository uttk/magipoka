import { it, describe, expect } from "vitest";

import { filterGenerateTarget } from "./generate";

import { GenerateTargetTypes } from "../types";

describe("filterGenerateTarget() Tests", () => {
  it("return a only parent string", () => {
    const target: GenerateTargetTypes[] = ["next", "next/link"];
    expect(filterGenerateTarget(target)).toStrictEqual(["next"]);
  });

  it("return children strings", () => {
    const target = ["next/link", "next/router"] as unknown as GenerateTargetTypes[];
    expect(filterGenerateTarget(target)).toStrictEqual(["next/link", "next/router"]);
  });
});
