## Why developping our own UI ?

When I first develop my web app using react, I didn't use any UI library. I didn't want to boilerplate the project. My development goal was a clean and thin project. Back in time I was learning React, and it's a good idea not to add complexity. Eventually, I got a working app without any style, using only HTML vanilla inputs, and I learned the basics of React.
Then I wanted an improved version which I could enjoy using. This would force me to study and apply UX/UI fields, and learn React in-depth. To achieve the improved version, I first start to use material-ui, a library for React featuring lots of components using Google Material design. It went well, but I wasn't satisfied with the customisation and JSS + I wasn't learning that much. Of course you can have a very well designed web app and still use vanilla HTML input. Most sites do that, eg: GitHub, where most control elements are native one + some web components (like text-expander to integrate smiley and mention to the native text-area). Actually I think only big company can afford the time to develop a full-featured UI library, with custom inputs built from scratch.

When you use UI libraries, all the complex stuff is already here and your job is only to compose the components, tweak around, use specific fix to these libraries, etc... This way you learn how to use this library but not how it works internaly. And you know it's often a better option to learn the language first rather than framework. The worth thing to do for a JS newbie would be to first start to build a web app using a specific UI library built for a specific framework. Instead, when you start with the language, rewriting existing algotihm, data structure enable you to learn using only what the language offers, focusing you on this rather than a library API. It's only after being comfortable with the language that you can add complexity - standard library, then framework, ... Each layer being built on the previous, simpler one. Building your own UI/route/state management library let you focus solely on React capacities so you can become very comfortable with it (or some sides of it, as these libraries doesn't cover all usage of React, particularly deployment, production code, server side rendering aren't covered, but you can't escape it anyway).

Building your own UI library may also means creating your own design system, visual language, and so on. One cons of using existing lib is that, despite customization capabilities, all apps using it will looks pretty much the same. You may change the colors, maybe some of the shape, but you won't be able to change more than that. It's ok for prototyping or if you don't have the resources to elaborate your own. In design, the silver bullet does not exist, there is no such a fit-all-project design system. Design will depend on plateform, usage frequency, users, branding and the project itself. Each big company with client app have taken the time to work out a design system or pattern library, [check this out with Adele](https://adele.uxpin.com/), [top 12 design systems](https://enonic.com/blog/top-12-design-systems). Even if you don't use custom inputs, you can still make it shine your brand aura.

Another pros is controlling the tech stack. Libraries can come with their dependencies that we have to integrate in order to use them with their full potential. When you are building your own lib, you decide what to use, the technologies you are the most comfortable with, etc... It's a real plus because on the long term, when the motivation from the early days evaporated, working with a tech stack you enjoy will help you to keep going.

Last (but not least :), you can build a solution specific for your needs, cutting down boilerplate and package size foundf in general-purpose libraries. You could use cutting-edge techniques to reduce bundle-size, enhance efficiency and so on, because you control the tech stack. Older and widely used libs will surely take a lot of time before using these techniques. Side note: using vanilla input (checkbox, inputs, dropdown), will avoid a huge amount of code from replacing them with from scratch custom elements.

## Design choices

Why building custom components that souldn't deviate from original behavior rather than using vanilla HTML elements (input, select, checkbox, etc...)?

- Allow maximal customization. Vanilla elements can be hard to apply style to (eg: the date picker). If you have to add fonctionalities, it may be impossible with vanilla (think about a select where each option have a leading icon). The thing is: if you want to replace vanilla with custom, and still support accessibility, it may be hard or time consuming to develop them well.
- Consistensy: vanilla elements are rendered differently depending on browser, OS and platform. If you want to provide a consistent experience, you may have no choice but using custom components. Also, a bunch of vanilla elements lack of browser support (eg: input type month or week) and fallback to simple text input. If you develop components not available natively, like tabs, you can easily feel the whole experience homogenenous if you replace native components with custom one.

About Vanilla Elements
| Pros | Cons |
|:---- |:---- |
| Accessible: great keyboard support, sementic | Not supported by all browser |
| Render nicely on mobile | Inconsistent rendering between plateform |

About Custom Elements
| Pros | Cons |
|:---- |:---- |
| Full control over rendering | Have to be developed |
| | Heavyweight |

About vanilla inputs not supported by all browser, a solution would be to detect the platform and expose an alternative.

One goal I had when I started designing the lib was to keep it thin & light. Relying on ES6 module & Webpack, only imported functions are bundled, so I didn't wanted to exports large multi-features generic components that supports a bunch of edge-case. What is the strategy when it comes to supporting new features? How to enable composition of features & components? For example: the Button. One may want to have a button with ripple effect, the other one without, or with elevation, icons, etc. Of course if I include a simple button with none of the above, I don't want to include the code handling ripple, elevation & co in my bundle. A simple solution could be to create differents button with only the required features, depending on the current needs. As it's a combinatory of feature, the number of specific components to support in lib-land will be too high. A good choice would be to provide the tools for the user to compose it's own component: a simple button with extra elevation & ripple for example. Is it possible to do something as simple as `myButtonWithRipple = pipe(button, rippleEffect)`? How the rippleEffect could know how to apply his effect on the button? And for more complicated components like a date picker? It must be more specific on which part of the component it has to have the effect on. A solution I used for my lib was: defining features/effects as a prop object. By prop object, I mean an object that will be spread on a target component to apply specific values to specific properties belonging to this component. By default all my custom component properties inherit from HTML Div attributes. Then, it applies unused properties on its main div. Internaly, custom props are merged with props defined in the component so there is no conflicts. It makes sense for small or simple components: the main div is generally the one to customize if you want special effects like ripple or elevation. For complex component, a solution would be to break it down into multiple components, and allow user to change the inner components as long as they implements some properties needed for the host, complex component. Specifiying inner components would allow user to customize them like the small one. Uber design system (base) address component customization using a similar solution: the Overrides pattern. You can customize props, style & the whole component through the override prop. Each internal component has its identifier in this prop, even the root component. In my case, as every components inherit from Div attributes, it's not useful to add root in the override prop. Styles can be customized through theme, which is a React context. For complex components, it doesn't let user granularly customize similar sub-components. For example if you have a component with two buttons, providing an overrided theme will affect both buttons. The only way to have a finer granularity is to override the button component itself (that means that both button should have an unique identifier in an override prop). A good way to test the robustness of this design is to try to handle edge case, feature addition, custom effects on an existing simple component.

When designing a complex component, instead of trying to generalize the top parent component, and specialize child component, it may be better to do the other way around. When composing elements, logic should stay in the specialized parent, because it's easier to have one parent as an orchestrator than children trying to communicate (which tighten them).

## Development with React

There are multiple approach to design modular components in React. The first I tried was to build in a functional fashion all the way up. This way, you stop writing JSX, but you compose functions.

For simple component creation:

```tsx
const divElem = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />;
const addAfter = (elem: Node | string) => (props: any) => ({
  ...props,
  children: (
    <>
      {props.children}
      {elem}
    </>
  ),
});
const addClass = (...newClass: string[]) => (props: any) => ({ ...props, className: cx([props.className, ...newClass]) });

export const MyBytton = compose(addAfter('Button'), addClass(borderRadius(4), textTransform('uppercase')), divElem)({});
```

Then all state is kept in an App State, all state logic is handled by a reducer and render logic is handled by dedicated generic functions. Programming this way is cumbersome, can be hard to understand how the data flow is coordinated and hasn't a good support from TypeScript. Functional fashion is still a very good thing, reason react is cool but I wanted something more flexible.
High Order Component can be composed in the same way, but each time it wraps the initial component by another one. I don't like this idea.
Render props can be elegant for handling conditional rendering. For me, the arrival of hooks change everything. Instead of writing PureComponents, you can write simple function, without overhead, skipping deep component tree nesting, and still benefit from "pure" perf using React.memo.

When I used Material-UI, I found the theme mechanism appealing. One config, in one place, to affect the styling of every used components. Easy to configure as it's just a key-value structure. When it's dynamically edited, changes are immediatly reflected. And it's a great way for component designer to be consistent, storing styling values and reusing them across components. Using a theme can be a great help when you tackle responsivness, or ambiant-awareness : the theme is dynamically build in respond to context. Technically, before Hooks introduction, I used Emotion `ThemeProvider`, which provide a theme at the root node and that you can use in your components using the HoC `withTheme`. Now, I can just use what React natively provides, with useContext hook. I'm not an advocate of big config file, so to tackle default theme, I prefer when each component defines it's own theme (but can access a common theme config), and expose it through an interface. Each component receive the user's theme, merge it with its own theme (which is first merged with what is needed from the common theme) and then used to style the component. To make the theme responsible, it's quite easy, you just need a set of rules and a function which return a built theme from a set of active rules. It could also be possible to use a reducer with the current theme a the newly enabled or disabled rule, but it may be less flexible. Rules are standard media query.

## Monorepos

Pros of monorepos:

- transparency: With polyrepos, you could easily loose track of what is being made, with new repos being made without even knowing it. Pull requests are only checked by people working on the same repo.
- Quicker & safer changes: after making a change to a lib, with a monorepo, you run the tests on all the differents projects that could depend on that lib. You can modify code on multiple projects in one pass.
