# Progress

## Moving to new cothority library

### WIP
- going through cothority, cleaning up classes

### TODO
- clean up registration of user in Contact.ts - only use credentialInstance, and derive everything from there
- unifying instance-classes in dedis/cothority

### DONE

### BUG

- if a user is registered from stale contact data, the newly registered user will lose all his added attributes.
- testing pgp
