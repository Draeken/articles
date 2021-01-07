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
on initie Formik avec les propriétés initialValues, et le callbacks onSubmit. On y imbrique ensuite le formulaire via Form (composant qui bind le submit natif au submit de Formik) et des composants Field. à chaque field, on renseigne la propriété name, qui doit avoir une valeur correspondante dans le initialValues (il est possible d'avoir des sous objets -> "fieldA.subfieldB").

La validation :
- fonction avec un objet contenant l'ensemble des valeurs du formulaire, nous laisse gérer comment le valider et retourner un objet errors reprenant les champs du formulaire. Cette méthode supporte la validation asynchrone.
- schéma de validation (avec la lib de validation Yup)
- propriété validate de Field / useField. peut être asynchrone et sera mergé avec la validation racine. Est exécuté à chaque onChange/onBlur, et avant une soumission par défaut (peut être modifié via validateOnChange/OnBlur sur le composant Formik racine).