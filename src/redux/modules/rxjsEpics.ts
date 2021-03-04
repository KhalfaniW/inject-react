import {ofType} from "redux-observable";

import {tap, mapTo, map} from "rxjs/operators";

import {
  retrieveEffectStore,
  updateEffectStore,
  EffectStore,
} from "./effectStore";

import {
  ElementShown,
  getElementShown,
  getIsOriginalElementHidden,
  hideOriginalElement,
  injectElement,
  showOriginalElement,
} from "../../replace-element";
import DOMSelectors from "../../tools/youtube-element-selectors";

let DomElements = [];
//Dom nodes cant goin app state or store
//store effect data here
export function getEffectStore() {
  throw Error("do not implemented");
}
const safelyEndEpic = () => {
  return map((action: any) => {
    return {
      type: action.type + "_HANLDED",
    };
  });
};

// function createElementAndReactState() {
//   return {
//     elementState: "Hidden",
//     elementPair: [],
//   };
// }
export function getTotalThumbnailsHidden(effectStore: EffectStore) {
  const allShownElements = effectStore.elementPairs.filter((elementPair) =>
    getIsOriginalElementHidden({elementPair}),
  );
  return allShownElements.length;
}

export function getTotalThumbnailsShown(effectStore: EffectStore) {
  const allHiddenElements = effectStore.elementPairs.filter(
    (elementPair) => getElementShown({elementPair}) === ElementShown.React,
  );
  return allHiddenElements.length;
}
//NOTE: If you let an incoming action pass through, it will create an infinite loop:
//TODO change ofType to auto map to dif type

//TODO move effect store to only change on dispatch

export const initializeAppInjectEpic = (action$: any) =>
  action$.pipe(
    ofType("INITIALIZE"),

    tap((action: any) => {
      // action$.document.
      const effectStore = retrieveEffectStore();
      effectStore.document = action.document;

      DOMSelectors.getAllThumbnails(effectStore.document!).forEach(
        (element, thumbnailIndex) => {
          const elementPair = injectElement({
            currentDocument: effectStore.document!,
            jsx: action.renderAtIndex(thumbnailIndex),
            index: thumbnailIndex,
          });
          hideOriginalElement({elementPair});
          effectStore.elementPairs.push(elementPair);
        },
      );
      updateEffectStore(effectStore);
      action.onComplete();
    }),
    map((action: any) => {
      return {
        type: action.type + "_HANLDED",
        thumbnailCount: retrieveEffectStore().elementPairs,
      };
    }),
  );

export const showThumbnailEpic = (action$: any) =>
  action$.pipe(
    ofType("SHOW_THUMBNAIL"),
    tap((action: any) => {
      showOriginalElement({
        elementPair: retrieveEffectStore().elementPairs[action.index],
      });
    }),

    safelyEndEpic(),
  );

export const hideThumbnailEpic = (action$: any) =>
  action$.pipe(
    ofType("HIDE_THUMBNAIL"),
    tap((action: any) => {
      hideOriginalElement({
        elementPair: retrieveEffectStore().elementPairs[action.index],
      });
    }),
    safelyEndEpic(),
  );

export const pingEpic = (action$: any) =>
  action$.pipe(
    ofType("PING"),

    // delay(1000), // Asynchronously wait 1000ms then continue
    tap(() => {
      console.log("???PING epic called???");
    }),

    mapTo({type: action$.type + "_HANDLED"}),
  );
