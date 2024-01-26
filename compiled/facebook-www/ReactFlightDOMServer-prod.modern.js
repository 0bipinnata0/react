/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 * @nolint
 * @preventMunge
 * @preserve-invariant-messages
 */

"use strict";
var ReactDOM = require("react-dom"),
  React = require("react"),
  requestedClientReferencesKeys = new Set(),
  checkIsClientReference;
function isClientReference(reference) {
  if (null == checkIsClientReference)
    throw Error("Expected implementation for checkIsClientReference.");
  return checkIsClientReference(reference);
}
require("ReactFeatureFlags");
var byteLengthImpl = null;
function writeChunkAndReturn(destination, chunk) {
  destination.write(chunk);
  return !0;
}
var ReactDOMFlightServerDispatcher = {
  prefetchDNS: prefetchDNS,
  preconnect: preconnect,
  preload: preload,
  preloadModule: preloadModule,
  preinitStyle: preinitStyle,
  preinitScript: preinitScript,
  preinitModuleScript: preinitModuleScript
};
function prefetchDNS(href) {
  if ("string" === typeof href && href) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var hints = request.hints,
        key = "D|" + href;
      hints.has(key) || (hints.add(key), emitHint(request, "D", href));
    }
  }
}
function preconnect(href, crossOrigin) {
  if ("string" === typeof href) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var hints = request.hints,
        key = "C|" + (null == crossOrigin ? "null" : crossOrigin) + "|" + href;
      hints.has(key) ||
        (hints.add(key),
        "string" === typeof crossOrigin
          ? emitHint(request, "C", [href, crossOrigin])
          : emitHint(request, "C", href));
    }
  }
}
function preload(href, as, options) {
  if ("string" === typeof href) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var hints = request.hints,
        key = "L";
      if ("image" === as && options) {
        var imageSrcSet = options.imageSrcSet,
          imageSizes = options.imageSizes,
          uniquePart = "";
        "string" === typeof imageSrcSet && "" !== imageSrcSet
          ? ((uniquePart += "[" + imageSrcSet + "]"),
            "string" === typeof imageSizes &&
              (uniquePart += "[" + imageSizes + "]"))
          : (uniquePart += "[][]" + href);
        key += "[image]" + uniquePart;
      } else key += "[" + as + "]" + href;
      hints.has(key) ||
        (hints.add(key),
        (options = trimOptions(options))
          ? emitHint(request, "L", [href, as, options])
          : emitHint(request, "L", [href, as]));
    }
  }
}
function preloadModule(href, options) {
  if ("string" === typeof href) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var hints = request.hints,
        key = "m|" + href;
      if (!hints.has(key))
        return (
          hints.add(key),
          (options = trimOptions(options))
            ? emitHint(request, "m", [href, options])
            : emitHint(request, "m", href)
        );
    }
  }
}
function preinitStyle(href, precedence, options) {
  if ("string" === typeof href) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var hints = request.hints,
        key = "S|" + href;
      if (!hints.has(key))
        return (
          hints.add(key),
          (options = trimOptions(options))
            ? emitHint(request, "S", [
                href,
                "string" === typeof precedence ? precedence : 0,
                options
              ])
            : "string" === typeof precedence
            ? emitHint(request, "S", [href, precedence])
            : emitHint(request, "S", href)
        );
    }
  }
}
function preinitScript(href, options) {
  if ("string" === typeof href) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var hints = request.hints,
        key = "X|" + href;
      if (!hints.has(key))
        return (
          hints.add(key),
          (options = trimOptions(options))
            ? emitHint(request, "X", [href, options])
            : emitHint(request, "X", href)
        );
    }
  }
}
function preinitModuleScript(href, options) {
  if ("string" === typeof href) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var hints = request.hints,
        key = "M|" + href;
      if (!hints.has(key))
        return (
          hints.add(key),
          (options = trimOptions(options))
            ? emitHint(request, "M", [href, options])
            : emitHint(request, "M", href)
        );
    }
  }
}
function trimOptions(options) {
  if (null == options) return null;
  var hasProperties = !1,
    trimmed = {},
    key;
  for (key in options)
    null != options[key] &&
      ((hasProperties = !0), (trimmed[key] = options[key]));
  return hasProperties ? trimmed : null;
}
var ReactDOMCurrentDispatcher =
    ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Dispatcher,
  REACT_ELEMENT_TYPE = Symbol.for("react.element"),
  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
  REACT_SERVER_CONTEXT_TYPE = Symbol.for("react.server_context"),
  REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
  REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
  REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
  REACT_MEMO_TYPE = Symbol.for("react.memo"),
  REACT_LAZY_TYPE = Symbol.for("react.lazy"),
  REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel"),
  MAYBE_ITERATOR_SYMBOL = Symbol.iterator,
  currentActiveSnapshot = null;
function popToNearestCommonAncestor(prev, next) {
  if (prev !== next) {
    prev.context._currentValue = prev.parentValue;
    prev = prev.parent;
    var parentNext = next.parent;
    if (null === prev) {
      if (null !== parentNext)
        throw Error(
          "The stacks must reach the root at the same time. This is a bug in React."
        );
    } else {
      if (null === parentNext)
        throw Error(
          "The stacks must reach the root at the same time. This is a bug in React."
        );
      popToNearestCommonAncestor(prev, parentNext);
      next.context._currentValue = next.value;
    }
  }
}
function popAllPrevious(prev) {
  prev.context._currentValue = prev.parentValue;
  prev = prev.parent;
  null !== prev && popAllPrevious(prev);
}
function pushAllNext(next) {
  var parentNext = next.parent;
  null !== parentNext && pushAllNext(parentNext);
  next.context._currentValue = next.value;
}
function popPreviousToCommonLevel(prev, next) {
  prev.context._currentValue = prev.parentValue;
  prev = prev.parent;
  if (null === prev)
    throw Error(
      "The depth must equal at least at zero before reaching the root. This is a bug in React."
    );
  prev.depth === next.depth
    ? popToNearestCommonAncestor(prev, next)
    : popPreviousToCommonLevel(prev, next);
}
function popNextToCommonLevel(prev, next) {
  var parentNext = next.parent;
  if (null === parentNext)
    throw Error(
      "The depth must equal at least at zero before reaching the root. This is a bug in React."
    );
  prev.depth === parentNext.depth
    ? popToNearestCommonAncestor(prev, parentNext)
    : popNextToCommonLevel(prev, parentNext);
  next.context._currentValue = next.value;
}
var SuspenseException = Error(
  "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`"
);
function noop() {}
function trackUsedThenable(thenableState, thenable, index) {
  index = thenableState[index];
  void 0 === index
    ? thenableState.push(thenable)
    : index !== thenable && (thenable.then(noop, noop), (thenable = index));
  switch (thenable.status) {
    case "fulfilled":
      return thenable.value;
    case "rejected":
      throw thenable.reason;
    default:
      if ("string" !== typeof thenable.status)
        switch (
          ((thenableState = thenable),
          (thenableState.status = "pending"),
          thenableState.then(
            function (fulfilledValue) {
              if ("pending" === thenable.status) {
                var fulfilledThenable = thenable;
                fulfilledThenable.status = "fulfilled";
                fulfilledThenable.value = fulfilledValue;
              }
            },
            function (error) {
              if ("pending" === thenable.status) {
                var rejectedThenable = thenable;
                rejectedThenable.status = "rejected";
                rejectedThenable.reason = error;
              }
            }
          ),
          thenable.status)
        ) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
      suspendedThenable = thenable;
      throw SuspenseException;
  }
}
var suspendedThenable = null;
function getSuspendedThenable() {
  if (null === suspendedThenable)
    throw Error(
      "Expected a suspended thenable. This is a bug in React. Please file an issue."
    );
  var thenable = suspendedThenable;
  suspendedThenable = null;
  return thenable;
}
var currentRequest$1 = null,
  thenableIndexCounter = 0,
  thenableState = null;
function getThenableStateAfterSuspending() {
  var state = thenableState;
  thenableState = null;
  return state;
}
function readContext(context) {
  return context._currentValue;
}
var HooksDispatcher = {
  useMemo: function (nextCreate) {
    return nextCreate();
  },
  useCallback: function (callback) {
    return callback;
  },
  useDebugValue: function () {},
  useDeferredValue: unsupportedHook,
  useTransition: unsupportedHook,
  readContext: readContext,
  useContext: readContext,
  useReducer: unsupportedHook,
  useRef: unsupportedHook,
  useState: unsupportedHook,
  useInsertionEffect: unsupportedHook,
  useLayoutEffect: unsupportedHook,
  useImperativeHandle: unsupportedHook,
  useEffect: unsupportedHook,
  useId: useId,
  useSyncExternalStore: unsupportedHook,
  useCacheRefresh: function () {
    return unsupportedRefresh;
  },
  useMemoCache: function (size) {
    for (var data = Array(size), i = 0; i < size; i++)
      data[i] = REACT_MEMO_CACHE_SENTINEL;
    return data;
  },
  use: use
};
function unsupportedHook() {
  throw Error("This Hook is not supported in Server Components.");
}
function unsupportedRefresh() {
  throw Error("Refreshing the cache is not supported in Server Components.");
}
function useId() {
  if (null === currentRequest$1)
    throw Error("useId can only be used while React is rendering");
  var id = currentRequest$1.identifierCount++;
  return ":" + currentRequest$1.identifierPrefix + "S" + id.toString(32) + ":";
}
function use(usable) {
  if (
    (null !== usable && "object" === typeof usable) ||
    "function" === typeof usable
  ) {
    if ("function" === typeof usable.then) {
      var index = thenableIndexCounter;
      thenableIndexCounter += 1;
      null === thenableState && (thenableState = []);
      return trackUsedThenable(thenableState, usable, index);
    }
    if (usable.$$typeof === REACT_SERVER_CONTEXT_TYPE)
      return usable._currentValue;
  }
  throw Error("An unsupported type was passed to use(): " + String(usable));
}
function createSignal() {
  return new AbortController().signal;
}
function resolveCache() {
  var request = currentRequest ? currentRequest : null;
  return request ? request.cache : new Map();
}
var DefaultCacheDispatcher = {
    getCacheSignal: function () {
      var cache = resolveCache(),
        entry = cache.get(createSignal);
      void 0 === entry &&
        ((entry = createSignal()), cache.set(createSignal, entry));
      return entry;
    },
    getCacheForType: function (resourceType) {
      var cache = resolveCache(),
        entry = cache.get(resourceType);
      void 0 === entry &&
        ((entry = resourceType()), cache.set(resourceType, entry));
      return entry;
    }
  },
  isArrayImpl = Array.isArray,
  getPrototypeOf = Object.getPrototypeOf;
function objectName(object) {
  return Object.prototype.toString
    .call(object)
    .replace(/^\[object (.*)\]$/, function (m, p0) {
      return p0;
    });
}
function describeValueForErrorMessage(value) {
  switch (typeof value) {
    case "string":
      return JSON.stringify(
        10 >= value.length ? value : value.slice(0, 10) + "..."
      );
    case "object":
      if (isArrayImpl(value)) return "[...]";
      value = objectName(value);
      return "Object" === value ? "{...}" : value;
    case "function":
      return "function";
    default:
      return String(value);
  }
}
function describeElementType(type) {
  if ("string" === typeof type) return type;
  switch (type) {
    case REACT_SUSPENSE_TYPE:
      return "Suspense";
    case REACT_SUSPENSE_LIST_TYPE:
      return "SuspenseList";
  }
  if ("object" === typeof type)
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        return describeElementType(type.render);
      case REACT_MEMO_TYPE:
        return describeElementType(type.type);
      case REACT_LAZY_TYPE:
        var payload = type._payload;
        type = type._init;
        try {
          return describeElementType(type(payload));
        } catch (x) {}
    }
  return "";
}
function describeObjectForErrorMessage(objectOrArray, expandedName) {
  var objKind = objectName(objectOrArray);
  if ("Object" !== objKind && "Array" !== objKind) return objKind;
  objKind = -1;
  var length = 0;
  if (isArrayImpl(objectOrArray)) {
    var str = "[";
    for (var i = 0; i < objectOrArray.length; i++) {
      0 < i && (str += ", ");
      var value = objectOrArray[i];
      value =
        "object" === typeof value && null !== value
          ? describeObjectForErrorMessage(value)
          : describeValueForErrorMessage(value);
      "" + i === expandedName
        ? ((objKind = str.length), (length = value.length), (str += value))
        : (str =
            10 > value.length && 40 > str.length + value.length
              ? str + value
              : str + "...");
    }
    str += "]";
  } else if (objectOrArray.$$typeof === REACT_ELEMENT_TYPE)
    str = "<" + describeElementType(objectOrArray.type) + "/>";
  else {
    str = "{";
    i = Object.keys(objectOrArray);
    for (value = 0; value < i.length; value++) {
      0 < value && (str += ", ");
      var name = i[value],
        encodedKey = JSON.stringify(name);
      str += ('"' + name + '"' === encodedKey ? name : encodedKey) + ": ";
      encodedKey = objectOrArray[name];
      encodedKey =
        "object" === typeof encodedKey && null !== encodedKey
          ? describeObjectForErrorMessage(encodedKey)
          : describeValueForErrorMessage(encodedKey);
      name === expandedName
        ? ((objKind = str.length),
          (length = encodedKey.length),
          (str += encodedKey))
        : (str =
            10 > encodedKey.length && 40 > str.length + encodedKey.length
              ? str + encodedKey
              : str + "...");
    }
    str += "}";
  }
  return void 0 === expandedName
    ? str
    : -1 < objKind && 0 < length
    ? ((objectOrArray = " ".repeat(objKind) + "^".repeat(length)),
      "\n  " + str + "\n  " + objectOrArray)
    : "\n  " + str;
}
var ReactSharedInternals =
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  ReactSharedServerInternals =
    React.__SECRET_SERVER_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
if (!ReactSharedServerInternals)
  throw Error(
    'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
  );
var ObjectPrototype = Object.prototype,
  stringify = JSON.stringify,
  ReactCurrentCache = ReactSharedServerInternals.ReactCurrentCache,
  ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
function defaultErrorHandler(error) {
  console.error(error);
}
function defaultPostponeHandler() {}
var currentRequest = null;
function serializeThenable(request, thenable) {
  request.pendingChunks++;
  var newTask = createTask(
    request,
    null,
    currentActiveSnapshot,
    request.abortableTasks
  );
  switch (thenable.status) {
    case "fulfilled":
      return (
        (newTask.model = thenable.value), pingTask(request, newTask), newTask.id
      );
    case "rejected":
      var digest = logRecoverableError(request, thenable.reason);
      emitErrorChunk(request, newTask.id, digest);
      return newTask.id;
    default:
      "string" !== typeof thenable.status &&
        ((thenable.status = "pending"),
        thenable.then(
          function (fulfilledValue) {
            "pending" === thenable.status &&
              ((thenable.status = "fulfilled"),
              (thenable.value = fulfilledValue));
          },
          function (error) {
            "pending" === thenable.status &&
              ((thenable.status = "rejected"), (thenable.reason = error));
          }
        ));
  }
  thenable.then(
    function (value) {
      newTask.model = value;
      pingTask(request, newTask);
    },
    function (reason) {
      newTask.status = 4;
      reason = logRecoverableError(request, reason);
      emitErrorChunk(request, newTask.id, reason);
      request.abortableTasks.delete(newTask);
      null !== request.destination &&
        flushCompletedChunks(request, request.destination);
    }
  );
  return newTask.id;
}
function emitHint(request, code, model) {
  model = stringify(model);
  var id = request.nextChunkId++;
  code = "H" + code;
  code = id.toString(16) + ":" + code;
  request.completedHintChunks.push(code + model + "\n");
  !1 === request.flushScheduled &&
    0 === request.pingedTasks.length &&
    null !== request.destination &&
    ((model = request.destination),
    (request.flushScheduled = !0),
    flushCompletedChunks(request, model));
}
function readThenable(thenable) {
  if ("fulfilled" === thenable.status) return thenable.value;
  if ("rejected" === thenable.status) throw thenable.reason;
  throw thenable;
}
function createLazyWrapperAroundWakeable(wakeable) {
  switch (wakeable.status) {
    case "fulfilled":
    case "rejected":
      break;
    default:
      "string" !== typeof wakeable.status &&
        ((wakeable.status = "pending"),
        wakeable.then(
          function (fulfilledValue) {
            "pending" === wakeable.status &&
              ((wakeable.status = "fulfilled"),
              (wakeable.value = fulfilledValue));
          },
          function (error) {
            "pending" === wakeable.status &&
              ((wakeable.status = "rejected"), (wakeable.reason = error));
          }
        ));
  }
  return { $$typeof: REACT_LAZY_TYPE, _payload: wakeable, _init: readThenable };
}
function renderElement(request, task, type, key, ref, props) {
  if (null !== ref && void 0 !== ref)
    throw Error(
      "Refs cannot be used in Server Components, nor passed to Client Components."
    );
  if ("function" === typeof type) {
    if (isClientReference(type)) return [REACT_ELEMENT_TYPE, type, key, props];
    key = task.thenableState;
    task.thenableState = null;
    thenableIndexCounter = 0;
    thenableState = key;
    props = type(props);
    if (
      "object" === typeof props &&
      null !== props &&
      "function" === typeof props.then
    ) {
      type = props;
      if ("fulfilled" === type.status) return type.value;
      props = createLazyWrapperAroundWakeable(props);
    }
    return renderModelDestructive(request, task, emptyRoot, "", props);
  }
  if ("string" === typeof type) return [REACT_ELEMENT_TYPE, type, key, props];
  if ("symbol" === typeof type)
    return type === REACT_FRAGMENT_TYPE
      ? renderModelDestructive(request, task, emptyRoot, "", props.children)
      : [REACT_ELEMENT_TYPE, type, key, props];
  if (null != type && "object" === typeof type) {
    if (isClientReference(type)) return [REACT_ELEMENT_TYPE, type, key, props];
    switch (type.$$typeof) {
      case REACT_LAZY_TYPE:
        var init = type._init;
        type = init(type._payload);
        return renderElement(request, task, type, key, ref, props);
      case REACT_FORWARD_REF_TYPE:
        return (
          (type = type.render),
          (key = task.thenableState),
          (task.thenableState = null),
          (thenableIndexCounter = 0),
          (thenableState = key),
          (props = type(props, void 0)),
          renderModelDestructive(request, task, emptyRoot, "", props)
        );
      case REACT_MEMO_TYPE:
        return renderElement(request, task, type.type, key, ref, props);
    }
  }
  throw Error(
    "Unsupported Server Component type: " + describeValueForErrorMessage(type)
  );
}
function pingTask(request, task) {
  var pingedTasks = request.pingedTasks;
  pingedTasks.push(task);
  1 === pingedTasks.length &&
    ((request.flushScheduled = null !== request.destination),
    performWork(request));
}
function createTask(request, model, context, abortSet) {
  var id = request.nextChunkId++;
  "object" === typeof model &&
    null !== model &&
    request.writtenObjects.set(model, id);
  var task = {
    id: id,
    status: 0,
    model: model,
    context: context,
    ping: function () {
      return pingTask(request, task);
    },
    toJSON: function (parentPropertyName, value) {
      try {
        var JSCompiler_inline_result = renderModelDestructive(
          request,
          task,
          this,
          parentPropertyName,
          value
        );
      } catch (thrownValue) {
        if (
          ((parentPropertyName =
            thrownValue === SuspenseException
              ? getSuspendedThenable()
              : thrownValue),
          (value = task.model),
          (value =
            "object" === typeof value &&
            null !== value &&
            (value.$$typeof === REACT_ELEMENT_TYPE ||
              value.$$typeof === REACT_LAZY_TYPE)),
          "object" === typeof parentPropertyName &&
            null !== parentPropertyName &&
            "function" === typeof parentPropertyName.then)
        ) {
          request.pendingChunks++;
          JSCompiler_inline_result = createTask(
            request,
            task.model,
            currentActiveSnapshot,
            request.abortableTasks
          );
          var ping = JSCompiler_inline_result.ping;
          parentPropertyName.then(ping, ping);
          JSCompiler_inline_result.thenableState =
            getThenableStateAfterSuspending();
          JSCompiler_inline_result = value
            ? "$L" + JSCompiler_inline_result.id.toString(16)
            : serializeByValueID(JSCompiler_inline_result.id);
        } else if (value)
          request.pendingChunks++,
            (value = request.nextChunkId++),
            (parentPropertyName = logRecoverableError(
              request,
              parentPropertyName
            )),
            emitErrorChunk(request, value, parentPropertyName),
            (JSCompiler_inline_result = "$L" + value.toString(16));
        else throw parentPropertyName;
      }
      return JSCompiler_inline_result;
    },
    thenableState: null
  };
  abortSet.add(task);
  return task;
}
function serializeByValueID(id) {
  return "$" + id.toString(16);
}
function serializeClientReference(
  request,
  parent,
  parentPropertyName,
  clientReference
) {
  var JSCompiler_inline_result = clientReference.getModuleId();
  requestedClientReferencesKeys.add(JSCompiler_inline_result);
  JSCompiler_inline_result = clientReference.getModuleId();
  var writtenClientReferences = request.writtenClientReferences,
    existingId = writtenClientReferences.get(JSCompiler_inline_result);
  if (void 0 !== existingId)
    return parent[0] === REACT_ELEMENT_TYPE && "1" === parentPropertyName
      ? "$L" + existingId.toString(16)
      : serializeByValueID(existingId);
  try {
    var clientReferenceMetadata = {
      moduleId: clientReference.getModuleId(),
      exportName: "default"
    };
    request.pendingChunks++;
    var importId = request.nextChunkId++,
      json = stringify(clientReferenceMetadata),
      processedChunk = importId.toString(16) + ":I" + json + "\n";
    request.completedImportChunks.push(processedChunk);
    writtenClientReferences.set(JSCompiler_inline_result, importId);
    return parent[0] === REACT_ELEMENT_TYPE && "1" === parentPropertyName
      ? "$L" + importId.toString(16)
      : serializeByValueID(importId);
  } catch (x) {
    return (
      request.pendingChunks++,
      (parent = request.nextChunkId++),
      (parentPropertyName = logRecoverableError(request, x)),
      emitErrorChunk(request, parent, parentPropertyName),
      serializeByValueID(parent)
    );
  }
}
function outlineModel(request, value) {
  request.pendingChunks++;
  value = createTask(
    request,
    value,
    currentActiveSnapshot,
    request.abortableTasks
  );
  retryTask(request, value);
  return value.id;
}
var modelRoot = !1;
function renderModelDestructive(
  request,
  task,
  parent,
  parentPropertyName,
  value
) {
  task.model = value;
  if (value === REACT_ELEMENT_TYPE) return "$";
  if (null === value) return null;
  if ("object" === typeof value) {
    switch (value.$$typeof) {
      case REACT_ELEMENT_TYPE:
        parent = request.writtenObjects;
        parentPropertyName = parent.get(value);
        if (void 0 !== parentPropertyName) {
          if (-1 === parentPropertyName)
            return (
              (request = outlineModel(request, value)),
              serializeByValueID(request)
            );
          if (modelRoot === value) modelRoot = null;
          else return serializeByValueID(parentPropertyName);
        } else parent.set(value, -1);
        return renderElement(
          request,
          task,
          value.type,
          value.key,
          value.ref,
          value.props
        );
      case REACT_LAZY_TYPE:
        return (
          (parent = value._init),
          (value = parent(value._payload)),
          renderModelDestructive(request, task, emptyRoot, "", value)
        );
    }
    if (isClientReference(value))
      return serializeClientReference(
        request,
        parent,
        parentPropertyName,
        value
      );
    task = request.writtenObjects;
    parent = task.get(value);
    if ("function" === typeof value.then) {
      if (void 0 !== parent)
        if (modelRoot === value) modelRoot = null;
        else return "$@" + parent.toString(16);
      request = serializeThenable(request, value);
      task.set(value, request);
      return "$@" + request.toString(16);
    }
    if (void 0 !== parent) {
      if (-1 === parent)
        return (
          (request = outlineModel(request, value)), serializeByValueID(request)
        );
      if (modelRoot === value) modelRoot = null;
      else return serializeByValueID(parent);
    } else task.set(value, -1);
    if (isArrayImpl(value)) return value;
    if (value instanceof Map) {
      value = Array.from(value);
      for (task = 0; task < value.length; task++)
        (parent = value[task][0]),
          "object" === typeof parent &&
            null !== parent &&
            ((parentPropertyName = request.writtenObjects),
            void 0 === parentPropertyName.get(parent) &&
              parentPropertyName.set(parent, -1));
      return "$Q" + outlineModel(request, value).toString(16);
    }
    if (value instanceof Set) {
      value = Array.from(value);
      for (task = 0; task < value.length; task++)
        (parent = value[task]),
          "object" === typeof parent &&
            null !== parent &&
            ((parentPropertyName = request.writtenObjects),
            void 0 === parentPropertyName.get(parent) &&
              parentPropertyName.set(parent, -1));
      return "$W" + outlineModel(request, value).toString(16);
    }
    null === value || "object" !== typeof value
      ? (request = null)
      : ((request =
          (MAYBE_ITERATOR_SYMBOL && value[MAYBE_ITERATOR_SYMBOL]) ||
          value["@@iterator"]),
        (request = "function" === typeof request ? request : null));
    if (request) return Array.from(value);
    request = getPrototypeOf(value);
    if (
      request !== ObjectPrototype &&
      (null === request || null !== getPrototypeOf(request))
    )
      throw Error(
        "Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported."
      );
    return value;
  }
  if ("string" === typeof value) {
    if (
      "Z" === value[value.length - 1] &&
      parent[parentPropertyName] instanceof Date
    )
      return "$D" + value;
    if (1024 <= value.length) {
      request.pendingChunks += 2;
      task = request.nextChunkId++;
      if (null == byteLengthImpl)
        throw Error(
          "byteLengthOfChunk implementation is not configured. Please, provide the implementation via ReactFlightDOMServer.setConfig(...);"
        );
      parent = byteLengthImpl(value);
      parent = task.toString(16) + ":T" + parent.toString(16) + ",";
      request.completedRegularChunks.push(parent, value);
      return serializeByValueID(task);
    }
    request = "$" === value[0] ? "$" + value : value;
    return request;
  }
  if ("boolean" === typeof value) return value;
  if ("number" === typeof value)
    return Number.isFinite(value)
      ? 0 === value && -Infinity === 1 / value
        ? "$-0"
        : value
      : Infinity === value
      ? "$Infinity"
      : -Infinity === value
      ? "$-Infinity"
      : "$NaN";
  if ("undefined" === typeof value) return "$undefined";
  if ("function" === typeof value) {
    if (isClientReference(value))
      return serializeClientReference(
        request,
        parent,
        parentPropertyName,
        value
      );
    throw Error("isServerReference: Not Implemented.");
  }
  if ("symbol" === typeof value) {
    task = request.writtenSymbols;
    var existingId$9 = task.get(value);
    if (void 0 !== existingId$9) return serializeByValueID(existingId$9);
    existingId$9 = value.description;
    if (Symbol.for(existingId$9) !== value)
      throw Error(
        "Only global symbols received from Symbol.for(...) can be passed to Client Components. The symbol Symbol.for(" +
          (value.description + ") cannot be found among global symbols.") +
          describeObjectForErrorMessage(parent, parentPropertyName)
      );
    request.pendingChunks++;
    parent = request.nextChunkId++;
    parentPropertyName = stringify("$S" + existingId$9);
    parentPropertyName = parent.toString(16) + ":" + parentPropertyName + "\n";
    request.completedImportChunks.push(parentPropertyName);
    task.set(value, parent);
    return serializeByValueID(parent);
  }
  if ("bigint" === typeof value) return "$n" + value.toString(10);
  throw Error(
    "Type " +
      typeof value +
      " is not supported in Client Component props." +
      describeObjectForErrorMessage(parent, parentPropertyName)
  );
}
function logRecoverableError(request, error) {
  request = request.onError;
  error = request(error);
  if (null != error && "string" !== typeof error)
    throw Error(
      'onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' +
        typeof error +
        '" instead'
    );
  return error || "";
}
function fatalError(request, error) {
  null !== request.destination
    ? ((request.status = 2),
      (request = request.destination),
      request.onError(error),
      request.close())
    : ((request.status = 1), (request.fatalError = error));
}
function emitErrorChunk(request, id, digest) {
  digest = { digest: digest };
  id = id.toString(16) + ":E" + stringify(digest) + "\n";
  request.completedErrorChunks.push(id);
}
var emptyRoot = {};
function retryTask(request, task) {
  if (0 === task.status) {
    var prev = currentActiveSnapshot,
      next = task.context;
    prev !== next &&
      (null === prev
        ? pushAllNext(next)
        : null === next
        ? popAllPrevious(prev)
        : prev.depth === next.depth
        ? popToNearestCommonAncestor(prev, next)
        : prev.depth > next.depth
        ? popPreviousToCommonLevel(prev, next)
        : popNextToCommonLevel(prev, next),
      (currentActiveSnapshot = next));
    try {
      modelRoot = task.model;
      var resolvedModel = renderModelDestructive(
        request,
        task,
        emptyRoot,
        "",
        task.model
      );
      modelRoot = resolvedModel;
      var json =
          "string" === typeof resolvedModel
            ? stringify(resolvedModel)
            : stringify(resolvedModel, task.toJSON),
        processedChunk = task.id.toString(16) + ":" + json + "\n";
      request.completedRegularChunks.push(processedChunk);
      request.abortableTasks.delete(task);
      task.status = 1;
    } catch (thrownValue) {
      (prev =
        thrownValue === SuspenseException
          ? getSuspendedThenable()
          : thrownValue),
        "object" === typeof prev &&
        null !== prev &&
        "function" === typeof prev.then
          ? ((request = task.ping),
            prev.then(request, request),
            (task.thenableState = getThenableStateAfterSuspending()))
          : (request.abortableTasks.delete(task),
            (task.status = 4),
            (prev = logRecoverableError(request, prev)),
            emitErrorChunk(request, task.id, prev));
    }
  }
}
function performWork(request) {
  var prevDispatcher = ReactCurrentDispatcher.current;
  ReactCurrentDispatcher.current = HooksDispatcher;
  var prevRequest = currentRequest;
  currentRequest$1 = currentRequest = request;
  try {
    var pingedTasks = request.pingedTasks;
    request.pingedTasks = [];
    for (var i = 0; i < pingedTasks.length; i++)
      retryTask(request, pingedTasks[i]);
    null !== request.destination &&
      flushCompletedChunks(request, request.destination);
  } catch (error) {
    logRecoverableError(request, error), fatalError(request, error);
  } finally {
    (ReactCurrentDispatcher.current = prevDispatcher),
      (currentRequest$1 = null),
      (currentRequest = prevRequest);
  }
}
function flushCompletedChunks(request, destination) {
  destination.beginWriting();
  try {
    for (
      var importsChunks = request.completedImportChunks, i = 0;
      i < importsChunks.length;
      i++
    )
      request.pendingChunks--,
        writeChunkAndReturn(destination, importsChunks[i]);
    importsChunks.splice(0, i);
    var hintChunks = request.completedHintChunks;
    for (i = 0; i < hintChunks.length; i++)
      writeChunkAndReturn(destination, hintChunks[i]);
    hintChunks.splice(0, i);
    var regularChunks = request.completedRegularChunks;
    for (i = 0; i < regularChunks.length; i++)
      request.pendingChunks--,
        writeChunkAndReturn(destination, regularChunks[i]);
    regularChunks.splice(0, i);
    var errorChunks = request.completedErrorChunks;
    for (i = 0; i < errorChunks.length; i++)
      request.pendingChunks--, writeChunkAndReturn(destination, errorChunks[i]);
    errorChunks.splice(0, i);
  } finally {
    (request.flushScheduled = !1), destination.completeWriting();
  }
  destination.flushBuffered();
  0 === request.pendingChunks && destination.close();
}
var configured = !1;
exports.clearRequestedClientReferencesKeysSet = function () {
  requestedClientReferencesKeys.clear();
};
exports.getRequestedClientReferencesKeys = function () {
  return Array.from(requestedClientReferencesKeys);
};
exports.registerClientReference = function () {};
exports.registerServerReference = function () {
  throw Error("registerServerReference: Not Implemented.");
};
exports.renderToDestination = function (destination, model, options) {
  if (!configured)
    throw Error(
      "Please make sure to call `setConfig(...)` before calling `renderToDestination`."
    );
  var onError = options ? options.onError : void 0;
  if (
    null !== ReactCurrentCache.current &&
    ReactCurrentCache.current !== DefaultCacheDispatcher
  )
    throw Error("Currently React only supports one RSC renderer at a time.");
  ReactDOMCurrentDispatcher.current = ReactDOMFlightServerDispatcher;
  ReactCurrentCache.current = DefaultCacheDispatcher;
  var abortSet = new Set();
  options = [];
  var hints = new Set();
  onError = {
    status: 0,
    flushScheduled: !1,
    fatalError: null,
    destination: null,
    bundlerConfig: null,
    cache: new Map(),
    nextChunkId: 0,
    pendingChunks: 0,
    hints: hints,
    abortableTasks: abortSet,
    pingedTasks: options,
    completedImportChunks: [],
    completedHintChunks: [],
    completedRegularChunks: [],
    completedErrorChunks: [],
    writtenSymbols: new Map(),
    writtenClientReferences: new Map(),
    writtenServerReferences: new Map(),
    writtenProviders: new Map(),
    writtenObjects: new WeakMap(),
    identifierPrefix: "",
    identifierCount: 1,
    taintCleanupQueue: [],
    onError: void 0 === onError ? defaultErrorHandler : onError,
    onPostpone: defaultPostponeHandler
  };
  onError.pendingChunks++;
  model = createTask(onError, model, null, abortSet);
  options.push(model);
  onError.flushScheduled = null !== onError.destination;
  performWork(onError);
  if (1 === onError.status)
    (onError.status = 2),
      destination.onError(onError.fatalError),
      destination.close();
  else if (2 !== onError.status && null === onError.destination) {
    onError.destination = destination;
    try {
      flushCompletedChunks(onError, destination);
    } catch (error) {
      logRecoverableError(onError, error), fatalError(onError, error);
    }
  }
};
exports.setCheckIsClientReference = function (impl) {
  checkIsClientReference = impl;
};
exports.setConfig = function (config) {
  byteLengthImpl = config.byteLength;
  checkIsClientReference = config.isClientReference;
  configured = !0;
};
