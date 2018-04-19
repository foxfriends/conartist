/* @flow */

// hack until symbols exist...
export const VALID = 'valid'
export const EMPTY = 'empty'
export const INVALID = 'invalid'

export type Validation<E> = Valid | Empty | Invalid<E>
type Empty = { state: typeof EMPTY }
type Valid = { state: typeof VALID }
type Invalid<E> = { state: typeof INVALID, error: E }
