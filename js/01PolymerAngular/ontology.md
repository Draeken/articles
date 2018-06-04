```
'Chrome'(software)
'Component'(web)
'Creation'(Component)(web)(with-framework)
'with-framework'(web) {
  contains: ['React', 'Angular', 'Vue', 'Mithrill']
}
'Tag'(HTML)
'custom element'(web) {
  resolves(Rob Dodson): [{
    target: 'Creation'(Component)(web)(with-framework),
    with: [{ property: 'lock-in', how: 'works-anywhere' }]
  }, {
    target: 'Creation'(Component)(web)(without-framework),
    with: [{ property: 'cumbersome', how: 'provides-helpers' }]
  }],
  define: 'Tag'(HTML)
}
```

--
Which way ?
define 'Creation'(Component)(web)(custom element)(web) or
in 'custom element'(web)
How to defines relationship between properties ?
