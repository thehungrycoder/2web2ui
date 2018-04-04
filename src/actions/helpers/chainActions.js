/**
 return () =>
  actions[0].action({ {}, meta: { onSuccess: (results) =>
    actions[1].action({ ...results, meta: { onSuccess: (results) =>
      actions[2].action({ ...results, meta: { onSuccess: (results) =>
        actions[3].action({ ...results, meta: { onSuccess: (results) =>
          actions[4].action({ ...results, meta: { onSuccess: undefined })
        }})
      }})
    }})
  }});
 **/
export default function chainActions(...actions) {
  return actions.reduceRight((last, current) => {
    const meta = { onSuccess: last };
    return (results = {}) => current({ ...results, meta });
  }, undefined);
}
