# Migration Log

## Deviations

- `StudioContext.jsx` was added as a lightweight optional provider because the studio state is primarily owned by `useStudioDesign` on `StudioPage`, but keeping the provider leaves a clean sharing point if later studio subtrees need direct access.
- `FavoriteButton` was moved from the partial migration's `atoms/` folder into `molecules/` to match the requested tree and because it depends on `FavoritesContext`.
- The legacy `BeforeAfterSlider` partial component was removed and folded into `AIPromptPanel`, because the source HTML has the slider only inside that AI prompt section.

## Classname Notes

- Route active states use `NavLink` with CSS Module `active` classes in `Topbar` and `BottomNav`.
- Legacy visual class names such as `product-card`, `studio-layout`, `community-post`, and `cart-item` were preserved where they map directly to old HTML sections, while component folders now own React behavior.
- `styles/global.css` is a local copy of the legacy stylesheet for visual parity; `reset.css` and `tokens.css` are imported separately from `main.jsx`.

## Behavior Ports

- Favorite heart state now lives in `FavoritesContext` and is read through `useFavorite(productId)`.
- Product and Studio add-to-cart buttons now add items to `CartContext` and show a transient `Added` label for 1.4 seconds.
- Cart quantity and remove controls update live state, and order totals are computed from cart contents.
- Studio preview text, color, scale, rotation, mode, concept selection, garment selection, and AI suggestion text are handled in `useStudioDesign`.
- The before/after slider exists on Home and is now controlled React state applied through the `--reveal` CSS variable.

## Unmapped app.js Behavior

- No source `app.js` behavior was left without a React home.
