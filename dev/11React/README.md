# FAQ

## What is React:

React is an open source javascript front-end library whose focus is on UI, through an component pattern approach. THe user is free of choosing third party lib for other front-end tasks, like routing, testing, complex state management, animation, forms, SSR, etc... React is used for building single page application.

## What are the major features of React:

React use virtual dom instead of real dom, as it's less expensive to manipulate large chunk of dom and then commit the diff to real dom rather than doing all transformation in real dom.
React support server side rendering
React follow the unidirectional data flow pattern, from parent to child.
React allows the creation of reusable, composable UI component

## What is JSX

Syntax extension to ECMAScript, syntactic sugar for React.createElement() function. It allows us to use JavaScript expressivness to write HTML, instead of using specific structural directives like ngIf or v-if which force us to learn extra DSL (domain-specific language).

## What is the difference between elements & components

React elements are just plain unmutable object describing a tree of DOM nodes. It specifies the tag name, attributes and children. It will be transformed in DOM through React.render.
React components are a kind of element factory. It takes props input and output a JSX tree that will be translated in a react element. Components are defined with a ES6 class or a function.

## Pure Component

Pure component is a simple way to optimize your app as it only re-render when detecting a shallow difference of props or state. It does this through shouldComponentUpdate method. With non-pure component, by default, it's re-rendered with every call of shouldComponentUpdate (when new props or state are being received). Shallow difference compare the first level of keys of two given objects.
As this mechanism is only available for class component, there is a equivalent for functional component with React.memo. It only compare props tho.

## Set State callback function

as setState is asynchronous, the callback will be called once the state has finished being updated. You may also use componentDidUpdate if you use a class component to know when the update has occured.
setState will merge new state with previous state in class component but not when used with useState hook.

## Lifecycle

componentDidMount, willUnmount -> hooks equivalent `useEffect(() =>{ blabla, return () => cleanUp}, [])`

When a render order is emited:

- static getDerivedStateFromProps (uncommon), just before render call, return an object to update the state, useful to handle changes in props over time (transition)
- shouldComponentUpdate, a way to stop render -> hooks equivalent = React.memo(props => myComponent)
- getSnapshotBeforeUpdate (uncommon, used for layout animation, before dom updates): a way to capture information and pass down to the next lifecycle function: no hook equivalent
- componentDidUpdate: side effects on DOM

- componentDidCatch: error boundaries: if there is an error in the child tree, it's catched. No hook equivalent.
- static getDerivedStateFromError -> when an error is catched, can update the state to display an alternative tree. No hook equivalent.

## HOC

Before Hooks, a way to reuse logic was HOC. It's a function that takes a component and return a new component with added behavior. It act like a proxy and can modify props before passing them down to child component.

## Lifecycle mounting order

- constructor
- getDerivedStateFromProps
- render
- componentDidMount

# React internal logic

React output a dynamic tree that can be a Dom tree, iOS hierarchy or even json.
These tree consists of nodes, or "host instances". In the DOM context, these nodes are regular dom nodes
The host environment provides API to manage these host instances: eg: appendChild, removeChild, setAttribute.
React provides an abstraction on these API so you don't have to use them.

To works with an host environment, React is used with a renderer. It teaches React how to use host API to manage instances.
React-DOM, Native, Ink are React renderers.

The smallest build block is the host instance (like a DOM node), and in React, is the React element: a plain JS object describing the node.
React element are immutable and don't have their own persistent identity. They'r meant to be re-created and thrown away all the time.

React render method takes a react element and a host container to create, through host API, the host instances in the provided container to match the provided react element.

Because DOM node creation/destruction is slow (+ it loses scroll, focus or other state information), React will try to re-use the same host instances between different renders, when the type and place matches with the react element tree.

In react element's children array, null is a valid value. When using conditional rendering, it's either null or the revealed react element, so sibling nodes stay in the same place and are re-used between renders.

In array, if element are reordered, React will updates every nodes, because it's the same place & type, to match content of the newly ordered list. This is not optimal and can cause bug (input content are preserved even if it doesn't refer conceptually to the same item). To overcome that, React introduces key. Instead of updating, React will check if the previous render had a corresponding key, and reuse it, re-ordering siblings accordingly. It only works if the keyed element keeps the same parent.

Components are functions that takes on object of props and return a React element.

Components aren't meant to be called but rather used with JSX (that will transform them in a react element like { type: ComponentFn, props: {}}). Later, in React internals, the component will be called with its props. This allow React to add features around components lile lazy evaluation, optimized reconciliation, add local state to components.

The main body of a react function component is executed during render phase. Function passed to useEffect are executed asynchronously after the render and commit phase (layout and paint) but before next render. This is unlike componentDidMount/DidUpdate that are fired synchroniously after DOM mutation. If you need the same behavior as these lifecycle, there is useLayoutEffect, to prevent visual inconsistency.
