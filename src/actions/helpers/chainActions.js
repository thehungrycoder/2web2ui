/**
 return actions[0].action({ ...actions[0].args, meta: { onSuccess: (results) =>
    actions[1].action({ ...actions[1].args, results, meta: { onSuccess: () =>
      actions[2].action({ ...actions[2].args, meta: { onSuccess: () =>
        actions[3].action({ ...actions[3].args, meta: { onSuccess: () =>
          actions[4].action({ ...actions[4].args })
        }})
      }})
    }})
  }});
 **/
export default function chainActions(actions) {
  return actions.reduceRight((last, current, index) => {
    const meta = last ? { onSuccess: last } : null;
    if (index === 0) { // the first action gets called directly, without results from anything
      return current.action({ ...current.args, meta });
    }
    return (results) => current.action({ ...current.args, ...results, meta });
  }, undefined);
}
