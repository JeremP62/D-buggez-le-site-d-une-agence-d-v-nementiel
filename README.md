# 724 Events

## Description

L'application est le site d'une agence evenementielle.

## Pre-requis

- NodeJS >= v16.14.1

## Installation

- `yarn install`

## Lancement de l'application

- `yarn start`

## Tests

- `yarn test`

  1.Le Slider : page blanche
  2.L'ordre des événements du slider plus ancien
  3.selecteur de catégorie
  4.liste des évenements affiche pas le bon mois
  5.formulaire de contact avec confirmation
  6.Footer : aucune images affiché

1 : src>containers>Slider : _ useId() : name unique
_ key = ev.id ?? radioIdx
_ checked={index === radioIdx} + onChange={() => setIndex(radioIdx)}
_ useMemo + spread ([...data.focus]) \* comparateur new Date(b) - new Date(a)

3 : src>containers>Events :

const typeList = new Set(data?.events.map((event) => event.type));
<Select
selection={Array.from(typeList)}
onChange={(value) => (value ? changeType(value) : changeType(null))}
/>
