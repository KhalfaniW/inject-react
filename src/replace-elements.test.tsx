import React from "react";

import {injectReactInto} from "./";

test("inject react once", () => {
  const divGroup = '<div class="originalElement"></div>';
  document.body.innerHTML = divGroup;

  const elementPairs = injectReactInto({
    immediateParentNode: document.body,
    nonRecursiveChildFilterFunction: (element: HTMLElement) =>
      element.tagName.toLowerCase() === "div",
    previousElementPairs: [],
    renderAtIndex: (index: number) => (
      <div className="reactElement">{index}</div>
    ),
  });

  expect(elementPairs).toHaveLength(1);
});
test("inject multiple times has no effect", () => {
  const divGroup = '<div class="originalElement"></div>';
  document.body.innerHTML = divGroup;

  const elementPairsFirstTime = injectReactInto({
    immediateParentNode: document.body,
    nonRecursiveChildFilterFunction: (element: HTMLElement) =>
      element.tagName.toLowerCase() === "div",
    previousElementPairs: [],
    renderAtIndex: (index: number) => (
      <div className="reactElement">{index}</div>
    ),
  });

  const elementPairsSecondTime = injectReactInto({
    immediateParentNode: document.body,
    nonRecursiveChildFilterFunction: (element: HTMLElement) =>
      element.tagName.toLowerCase() === "div",
    previousElementPairs: elementPairsFirstTime,
    renderAtIndex: (index: number) => (
      <div className="reactElement">{index}</div>
    ),
  });

  expect(elementPairsSecondTime).toEqual([]);
  expect(elementPairsSecondTime).toHaveLength(0);
});

test("inject react again after adding more elements", () => {
  const divGroup = ` 
<div name="firstParent"><div></div></div>
<div name="secondParent"><div></div></div>
`;
  const testRender = (index: number) => (
    <p className="reactElement">testString_{index}</p>
  );
  const addChild = (element: Element) => {
    const documentReference = element.ownerDocument;
    const node = documentReference.createElement("div");
    element.appendChild(node);
  };

  document.body.innerHTML = divGroup;

  const elementPairsFirstTime = injectReactInto({
    immediateParentNode: document.body.children[0] as HTMLElement,
    nonRecursiveChildFilterFunction: (element: HTMLElement) =>
      element.tagName.toLowerCase() === "div",
    previousElementPairs: [],
    renderAtIndex: testRender,
  });

  for (var i = 0; i < 4; i++) {
    //NOTE: setting innerHTML will reset references
    addChild(document.body.children[0]);
  }

  const elementPairsSecondTime = injectReactInto({
    immediateParentNode: document.body.children[0] as HTMLElement,
    nonRecursiveChildFilterFunction: (element: HTMLElement) =>
      element.tagName.toLowerCase() === "div",
    previousElementPairs: elementPairsFirstTime,
    renderAtIndex: testRender,
  });

  expect(elementPairsSecondTime).toHaveLength(4);
  [0, 1, 2, 3, 4].forEach((number) => {
    expect(document.body.children[0].innerHTML).toContain(
      `testString_${number}`,
    );
  });
  const totalReactElementsCount = document.querySelectorAll("p").length;
  expect(totalReactElementsCount).toBe(5);
});
