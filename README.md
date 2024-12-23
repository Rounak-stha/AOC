# Advent of Code: Challenge Accepted

These challenges are written in JS with Deno as the runtime, so make sure you have deno installed on your system.
If you do not want to use deno, make sure you replace the following in every file with corresponding import from node instead

```js
import { join } from '@std/path/join
```

And update the utility methods too to instead ue Node fs.

## Instruction

Input data is not commited to this repo. You need to add the input for the day you want to solve to a folder name `data` in each day's file.
For example, if you want to run day 16, make sure that the input data exists in file `2024/day_16/data/inpu.txt`
```bash
# A task is configured in Deno json to make it easy to run tye solutin of each day using the following command
deno run day <DAY_NUM>
```
