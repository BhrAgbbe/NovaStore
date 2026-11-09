# Store Figma handoff

Figma’s component geometry, color values, Vazirmatn and Inter typography, hero image, and original icon paths drive the responsive implementation. Product images come from the API in the live app and the original Figma fixtures in browser tests.

| Figma section                 | Frames | Web mapping                                                                                                                                        |
| ----------------------------- | -----: | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core desktop                  |      3 | Persian homepage, populated cart, and empty cart at 1440px                                                                                         |
| Tablet                        |      3 | Persian homepage, populated cart, and empty cart at 834px                                                                                          |
| Mobile                        |      4 | Persian homepage, populated cart, empty cart, and expanded mobile menu at 390px                                                                    |
| Language and theme            |      6 | Homepage, populated cart, and empty cart in English light and Persian dark                                                                         |
| Catalog controls and feedback |     12 | Catalog anchor, Electronics filter, sort options, three sort choices, search match, no match, loading, request error, page two, and added feedback |
| Cart feedback and editing     |      4 | One item, quantity change, item removal, and clear confirmation                                                                                    |

The responsive test checks 360, 390, 767, 768, 834, 1023, 1024, and 1440px. The Figma Starter tool limit blocked connector extraction, so implementation used the approved Desktop handoff. Representative visual checks do not constitute a pixel-diff certification of every frame.
