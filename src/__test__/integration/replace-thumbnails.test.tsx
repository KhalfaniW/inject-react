import React from 'react';

import { createInjectElementFunction } from '../..';

test.only("inject element into DOM after adding more elements", () => {
  const divGroup = '<div class="originalElement"></div>';
  document.body.innerHTML = divGroup;

  const injectReactUIAtTime = createInjectElementFunction({
    querySelectorString: "div",
    renderAtThumbnailIndex: (index: number) => {
      return <div className="reactElement"></div>;
    },
    intervalTime: 500,
    currentTimeSinceEpoch: 0,
  });

  const firstElementPairsGroup = injectReactUIAtTime(0);

  expect(document.querySelectorAll("div.reactElement")).toHaveLength(1);

  document.body.innerHTML += "<div></div>".repeat(4);
  injectReactUIAtTime(100);
  expect(document.querySelectorAll("div.reactElement")).toHaveLength(1);
  injectReactUIAtTime(500);
  expect(document.querySelectorAll("div.reactElement")).toHaveLength(5);
});
