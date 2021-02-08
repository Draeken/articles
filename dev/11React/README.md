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
Pure component is a simple way to optimize your app as it only re-render when detecting a shallow difference of props or state. It does this through shouldComponentUpdate method. With non-pure component, by default, it's re-rendered with every call of shouldComponentUpdate (when new props or state are being received).

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