import {fireEvent, getByText} from "@testing-library/react";
import React from "react";

import {ActionNames} from "./thumbnail-hider";
import {
  HTMLElementReplacementPair,
  getThumbnailAndThumbnailContainer,
  injectElement,
  showOriginalElement,
  showReactElement,
} from "./replace-element";
import {insertYoutubeHtml} from "./__test__/youtube-tools";

const testContent = "FAKE text Content id=AFeEFWEfSDda";

test("get thumbnail successfuly", () => {
  expect(document.body.innerHTML.length).toBeLessThan(10);
  insertYoutubeHtml();
  expect(document.body.innerHTML.length).toBeGreaterThan(1000);
  const elementPair = getThumbnailAndThumbnailContainer({
    currentDocument: document,
    thumbnailIndex: 0,
  });
  debugger;
  expect(elementPair.originalThumbnail).toBeInTheDocument();
  expect(elementPair.thumbnailContainer).toBeInTheDocument();
});
test("replace one thumbnail item ", () => {
  insertYoutubeHtml();
  const reactOriginalPair = injectElement({
    currentDocument: document,
    jsx: <>{testContent}</>,
    index: 0,
  });
  expect(reactOriginalPair.originalElementToReplace).toBeVisible();

  showOriginalElement({elementPair: reactOriginalPair});

  /* expect(getReactComponent({elementPair: reactOriginalPair})).not.toBeVisible(); */
  expect(reactOriginalPair.reactComponentContainer).not.toBeVisible();
  showReactElement({elementPair: reactOriginalPair});
  /* expect(reactOriginalPair.originalElementToReplace).not.toBeVisible(); */
  expect(reactOriginalPair.reactComponentContainer).toBeVisible();
  expect(reactOriginalPair.originalElementToReplace).not.toBeVisible();
});

test("replacement item can be clicked", () => {
  let reactOriginalPair = {} as HTMLElementReplacementPair;
  const mockFunction = jest.fn(() => {});
  const clickHideThumbnail = () => {
    const showThumbnailButton = getByText(
      reactOriginalPair.reactComponentContainer,
      ActionNames.toggleThumbnail,
    );
    fireEvent.click(showThumbnailButton);
  };

  insertYoutubeHtml();
  reactOriginalPair = injectElement({
    currentDocument: document,
    jsx: <button onClick={mockFunction}>{ActionNames.toggleThumbnail}</button>,
    index: 0,
  });
  showReactElement({elementPair: reactOriginalPair});

  clickHideThumbnail();

  expect(mockFunction).toHaveBeenCalledTimes(1);
  /* expect(reactOriginalPair.originalElementToReplace).toBeVisible();
   * expect(reactOriginalPair.reactComponentContainer).not.toBeVisible(); */
});
