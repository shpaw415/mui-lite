/**
 * Single tab control used inside Tabs (re-export).
 *
 * @example Tab item
 * ```tsx
 * <Tabs value={tab} onChange={(_, v) => setTab(v)}>
 *   <Tab label="Overview" value="overview" />
 *   <Tab label="Details" value="details" />
 * </Tabs>
 * ```
 */
export { Tab as default, type TabProps } from "../Tabs";
