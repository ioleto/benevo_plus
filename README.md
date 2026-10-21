# Bénévo+

Bénévo+ met en relation les bénévoles et les besoins de communautés locales.

## Erreurs connues de la CI

### PR #31

- **Lint (`npm run lint`)** : `require()` dans les scripts JavaScript Node est conservé pour l’exécution dans le conteneur et couvert par `eslint-disable`; les variables inutilisées sont supprimées. Référence : PR #31.

## Communautés
La page `/app/communautes` explore uniquement les communautés publiques.
