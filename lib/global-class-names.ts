/**
 * CSS Modules are intentionally not used in this app. This helper keeps JSX
 * readable while returning the literal global class name for a property.
 */
export const globalClassNames = new Proxy<Record<string, string>>({}, {
  get: (_target, name) => typeof name === "string" ? name : "",
});
