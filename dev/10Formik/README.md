Rend la gestion des formulaires dans React moins verbeuse.
Intègre la validation, les statuts, la submission.
Utiliser Formik rend la gestion des formulaires homogène dans l'ensemble de l'app, plutôt que de trouver localement des solutions from scratch différentes. Cela rend la maintenance plus simple.
Par rapport aux autres choix (React Hook Form, Redux Form):
- déclaratif
- simple: pas de vas & vient de données, l'état est gardé localement dans le composant
- léger
- écrit en TypeScript, le typage est assuré d'être à jour et de qualité

Formik fournit le composant Field, venant remplacer le <input>, qui fait le binding en interne (onChange, onBlur, value).

Comment ça s'utilise :
on initie Formik avec les propriétés initialValues, et le callbacks onSubmit. On y imbrique ensuite le formulaire via Form (composant qui bind le submit natif au submit de Formik) et des composants Field. à chaque field, on renseigne la propriété name, qui doit avoir une valeur correspondante dans le initialValues (il est possible d'avoir des sous objets -> "fieldA.subfieldB" et des tableaux -> "fieldA[0]" ou "fieldA.0").
Formik peut prendre une fonction de rendu (plutôt que d'y mettre directement l'élément Form). Cela permet de récupérer différentes propriétés/callbacks de Formik comme validateForm, errors, touched.

La validation :
- fonction avec un objet contenant l'ensemble des valeurs du formulaire, nous laisse gérer comment le valider et retourner un objet errors reprenant les champs du formulaire. Cette méthode supporte la validation asynchrone.
- schéma de validation (avec la lib de validation Yup)
- propriété validate de Field / useField. peut être asynchrone et sera mergé avec la validation racine. Est exécuté à chaque onChange/onBlur, et avant une soumission par défaut (peut être modifié via validateOnChange/OnBlur sur le composant Formik racine).
L'affichage de l'erreur à l'écran est à la charge du dev (contrairement aux éléments natif du dom, pour les validations les plus courantes).
voici un exemple :
```typescript
{touched.username && errors.username && <div>{errors.username}</div>}
```

Utilisation avec des listes :
Pour gérer des listes, Formik fourni FieldArray qui récupère l'accès au tableau via sa propriété name. Ensuite on lui donne une fonction de rendu avec un arrayHelper en paramètre. Celui ci permettra de faire des ajouts & suppressions en s'occupant de la validation (gérer via le validateOnChange du FieldArray) et des états (pristine ou touched).
On récupère les éléments de la liste via le paramètre `values` de la fonction de rendu de Formik, et l'on boucle dessus pour créer les éléments du formulaire.
A noter que la fonction de rendu peut être remplacé par un composant indépendant (propriété component).