import { it, describe, expect } from "vitest";

import { filterGenerateTargets } from "./generate";

import { GenerateTargetTypes } from "../types";

describe("filterGenerateTargets() Tests", () => {
  it("return a only parent string", () => {
    const target = ["next", "next/link", "next/router"] as unknown as GenerateTargetTypes[];

    const result = filterGenerateTargets(target, target);

    expect(result).toStrictEqual(["next"]);
  });

  it("return children strings", () => {
    const target = ["next/link", "next/router"] as unknown as GenerateTargetTypes[];

    const result = filterGenerateTargets(target, target);

    expect(result).toStrictEqual(["next/link", "next/router"]);
  });

  it("exclude unsupported targets", () => {
    const unsupportedTarget = ["foo", "bar", "hello", "world"] as unknown as GenerateTargetTypes[];

    const result = filterGenerateTargets([], unsupportedTarget);

    expect(result).toHaveLength(0);
  });
});
