/**
 * @Author Created by ARCH on 12/29/16.
 * @Copyright (C) 2016
 * Barge Studios Inc, The Bumble-Bee Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence Licensed under the Barge Studios Eula
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 * http://www.bargestudios.com/bumblebee/licence
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *        \__/
 *    \  (-_-)  /
 *    \-( ___)-/
 *     ( ____)
 *   <-(____)->
 *    \      /
 *
 * @fileOverview Utilities for manipulating Objects/Maps/Hashes.
 * Shout outs to Erik Arvidsson aka arvomatic
 *
 * @requires Barge.utils
 *
 * @user MSG: Some lines in this file use constructs from es6 or later
 * to make it es5 compatible check for es6+ or #es6+ in comments
 */

var Barge = Barge || {};

(function (Bu)
{
   //cr8n the Barge.Object object
   /**
    * @static
    * @type {{}}
    */
   Barge.Object = Barge.Object || {};
   /**
    * Whether two values are not observably distinguishable. This
    * correctly detects that 0 is not the same as -0 and two NaNs are
    * practically equivalent.
    *
    * The implementation is as suggested by harmony:egal proposal.
    *
    * @param {*} v The first value to compare.
    * @param {*} v2 The second value to compare.
    * @return {boolean} Whether two values are not observably distinguishable.
    * @see http://wiki.ecmascript.org/doku.php?id=harmony:egal
    */
   Barge.Object.is = function (v, v2)
   {
      if (v === v2)
      {
         // 0 === -0, but they are not identical.
         // We need the cast because the compiler requires that v2 is a
         // number (although 1/v2 works with non-number). We cast to ? to
         // stop the compiler from type-checking this statement.
         return v !== 0 || 1 / v === 1 / /** @type {?} */ (v2);
      }

      // NaN is non-reflexive: NaN !== NaN, although they are identical.
      return v !== v && v2 !== v2;
   };

   /**
    * Calls a function for each element in an object/map/hash.
    *
    * @param {Object<K,V>} obj The object over which to iterate.
    * @param {function(this:T,V,?,Object<K,V>):?} f The function to call
    *     for every element. This function takes 3 arguments (the value, the
    *     key and the object) and the return value is ignored.
    * @param {T=} opt_obj This is used as the 'this' object within f.
    * @template T,K,V
    */
   Barge.Object.forEach = function (obj, f, opt_obj)
   {
      for (var key in obj)
      {
         f.call(/** @type {?} */ (opt_obj), obj[key], key, obj);
      }
   };

   /**
    * Calls a function for each element in an object/map/hash. If that call returns
    * true, adds the element to a new object.
    *
    * @param {Object<K,V>} obj The object over which to iterate.
    * @param {function(this:T,V,?,Object<K,V>):boolean} f The function to call
    *     for every element. This
    *     function takes 3 arguments (the value, the key and the object)
    *     and should return a boolean. If the return value is true the
    *     element is added to the result object. If it is false the
    *     element is not included.
    * @param {T=} opt_obj This is used as the 'this' object within f.
    * @return {!Object<K,V>} a new object in which only elements that passed the
    *     test are present.
    * @template T,K,V
    */
   Barge.Object.filter = function (obj, f, opt_obj)
   {
      var res = {};
      for (var key in obj)
      {
         if (f.call(/** @type {?} */ (opt_obj), obj[key], key, obj))
         {
            res[key] = obj[key];
         }
      }
      return res;
   };

   /**
    * For every element in an object/map/hash calls a function and inserts the
    * result into a new object.
    *
    * @param {Object<K,V>} obj The object over which to iterate.
    * @param {function(this:T,V,?,Object<K,V>):R} f The function to call
    *     for every element. This function
    *     takes 3 arguments (the value, the key and the object)
    *     and should return something. The result will be inserted
    *     into a new object.
    * @param {T=} opt_obj This is used as the 'this' object within f.
    * @return {!Object<K,R>} a new object with the results from f.
    * @template T,K,V,R
    */
   Barge.Object.map = function (obj, f, opt_obj)
   {
      var res = {};
      for (var key in obj)
      {
         res[key] = f.call(/** @type {?} */ (opt_obj), obj[key], key, obj);
      }
      return res;
   };

   /**
    * Calls a function for each element in an object/map/hash. If any
    * call returns true, returns true (without checking the rest). If
    * all calls return false, returns false.
    *
    * @param {Object<K,V>} obj The object to check.
    * @param {function(this:T,V,?,Object<K,V>):boolean} f The function to
    *     call for every element. This function
    *     takes 3 arguments (the value, the key and the object) and should
    *     return a boolean.
    * @param {T=} opt_obj This is used as the 'this' object within f.
    * @return {boolean} true if any element passes the test.
    * @template T,K,V
    */
   Barge.Object.some = function (obj, f, opt_obj)
   {
      for (var key in obj)
      {
         if (f.call(/** @type {?} */ (opt_obj), obj[key], key, obj))
         {
            return true;
         }
      }
      return false;
   };

   /**
    * Calls a function for each element in an object/map/hash. If
    * all calls return true, returns true. If any call returns false, returns
    * false at this point and does not continue to check the remaining elements.
    *
    * @param {Object<K,V>} obj The object to check.
    * @param {?function(this:T,V,?,Object<K,V>):boolean} f The function to
    *     call for every element. This function
    *     takes 3 arguments (the value, the key and the object) and should
    *     return a boolean.
    * @param {T=} opt_obj This is used as the 'this' object within f.
    * @return {boolean} false if any element fails the test.
    * @template T,K,V
    */
   Barge.Object.every = function (obj, f, opt_obj)
   {
      for (var key in obj)
      {
         if (!f.call(/** @type {?} */ (opt_obj), obj[key], key, obj))
         {
            return false;
         }
      }
      return true;
   };

   /**
    * returns an the value for an item in an Object
    * if it exists and null if otherwise
    * @param {Object<K,V>} obj The object to check.
    * @param {String} key The function to
    *
    * @return {boolean} null if the key does not exist.
    */
   Barge.Object.get = function (obj, key,)
   {
      if (key in  obj)
      {
         return obj[key]
      }
      return null
   };

   /**
    * Returns the number of key-value pairs in the object map.
    *
    * @param {Object} obj The object for which to get the number of key-value
    *     pairs.
    * @return {number} The number of key-value pairs in the object map.
    */
   Barge.Object.getCount = function (obj)
   {
      var rv = 0;
      for (var key in obj)
      {
         rv++;
      }
      return rv;
   };

   /**
    * Returns one key from the object map, if any exists.
    * For map literals the returned key will be the first one in most of the
    * browsers (a know exception is Konqueror).
    *
    * @param {Object} obj The object to pick a key from.
    * @return {string|undefined} The key or undefined if the object is empty.
    */
   Barge.Object.getAnyKey = function (obj)
   {
      for (var key in obj)
      {
         return key;
      }
   };

   /**
    * Returns one value from the object map, if any exists.
    * For map literals the returned value will be the first one in most of the
    * browsers (a know exception is Konqueror).
    *
    * @param {Object<K,V>} obj The object to pick a value from.
    * @return {V|undefined} The value or undefined if the object is empty.
    * @template K,V
    */
   Barge.Object.getAnyValue = function (obj)
   {
      for (var key in obj)
      {
         return obj[key];
      }
   };

   /**
    * Whether the object/hash/map contains the given object as a value.
    * An alias for Barge.Object.containsValue(obj, val).
    *
    * @param {Object<K,V>} obj The object in which to look for val.
    * @param {V} val The object for which to check.
    * @return {boolean} true if val is present.
    * @template K,V
    */
   Barge.Object.contains = function (obj, val)
   {
      return Barge.Object.containsValue(obj, val);
   };

   /**
    * Returns the values of the object/map/hash.
    *
    * @param {Object<K,V>} obj The object from which to get the values.
    * @return {!Array<V>} The values in the object/map/hash.
    * @template K,V
    */
   Barge.Object.getValues = function (obj)
   {
      var res = [];
      var i = 0;
      for (var key in obj)
      {
         res[i++] = obj[key];
      }
      return res;
   };

   /**
    * Returns the keys of the object/map/hash.
    *
    * @param {Object} obj The object from which to get the keys.
    * @return {!Array<string>} Array of property keys.
    */
   Barge.Object.getKeys = function (obj)
   {
      var res = [];
      var i = 0;
      for (var key in obj)
      {
         res[i++] = key;
      }
      return res;
   };

   /**
    * Get a value from an object multiple levels deep.  This is useful for
    * pulling values from deeply nested objects, such as JSON responses.
    * Example usage: getValueByKeys(jsonObj, 'foo', 'entries', 3)
    *
    * @param {!Object} obj An object to get the value from.  Can be array-like.
    * @param {...(string|number|!IArrayLike<number|string>)}var_args
    *     A number of keys (as strings, or numbers, for array-like objects).  Can also be
    *     specified as a single array of keys.
    * @return {*} The resulting value.  If, at any point, the value for a key
    *     is undefined, returns undefined.
    */
   Barge.Object.getValueByKeys = function (obj, var_args)
   {
      var isArrayLike = Barge.isArrayLike(var_args);
      var keys = isArrayLike ? var_args : arguments;

      // Start with the 2nd parameter for the variable parameters syntax.
      for (var i = isArrayLike ? 0 : 1; i < keys.length; i++)
      {
         obj = obj[keys[i]];
         if (!Barge.isDef(obj))
         {
            break;
         }
      }

      return obj;
   };

   /**
    * Whether the object/map/hash contains the given key.
    *
    * @param {Object} obj The object in which to look for key.
    * @param {?} key The key for which to check.
    * @return {boolean} true If the map contains the key.
    */
   Barge.Object.containsKey = function (obj, key)
   {
      return obj !== null && key in obj;
   };

   /**
    * Whether the object/map/hash contains the given value. This is O(n).
    *
    * @param {Object<K,V>} obj The object in which to look for val.
    * @param {V} val The value for which to check.
    * @return {boolean} true If the map contains the value.
    * @template K,V
    */
   Barge.Object.containsValue = function (obj, val)
   {
      for (var key in obj)
      {
         if (obj[key] == val)
         {
            return true;
         }
      }
      return false;
   };

   /**
    * Searches an object for an element that satisfies the given condition and
    * returns its key.
    * @param {Object<K,V>} obj The object to search in.
    * @param {function(this:T,V,string,Object<K,V>):boolean} f The
    *      function to call for every element. Takes 3 arguments (the value,
    *     the key and the object) and should return a boolean.
    * @param {T=} opt_this An optional "this" context for the function.
    * @return {string|undefined} The key of an element for which the function
    *     returns true or undefined if no such element is found.
    * @template T,K,V
    */
   Barge.Object.findKey = function (obj, f, opt_this)
   {
      for (var key in obj)
      {
         if (f.call(/** @type {?} */ (opt_this), obj[key], key, obj))
         {
            return key;
         }
      }
      return undefined;
   };

   /**
    * Searches an object for an element that satisfies the given condition and
    * returns its value.
    * @param {Object<K,V>} obj The object to search in.
    * @param {function(this:T,V,string,Object<K,V>):boolean} f The function
    *     to call for every element. Takes 3 arguments (the value, the key
    *     and the object) and should return a boolean.
    * @param {T=} opt_this An optional "this" context for the function.
    * @return {V} The value of an element for which the function returns true or
    *     undefined if no such element is found.
    * @template T,K,V
    */
   Barge.Object.findValue = function (obj, f, opt_this)
   {
      var key = Barge.Object.findKey(obj, f, opt_this);
      return key && obj[key];
   };

   /**
    * Whether the object/map/hash is empty.
    *
    * @param {Object} obj The object to test.
    * @return {boolean} true if obj is empty.
    */
   Barge.Object.isEmpty = function (obj)
   {
      for (var key in obj)
      {
         return false;
      }
      return true;
   };

   /**
    * Removes all key value pairs from the object/map/hash.
    *
    * @param {Object} obj The object to clear.
    */
   Barge.Object.clear = function (obj)
   {
      for (var i in obj)
      {
         delete obj[i];
      }
   };

   /**
    * Removes all key value pairs from the object/map/hash.
    *
    * @param {Object} obj The object to clear.
    */
   Barge.Object.destroy = function (obj)
   {
      for (var i in obj)
      {
         delete obj[i];
      }
   };



   /**
    * Removes a key-value pair based on the key.
    *
    * @param {Object} obj The object from which to remove the key.
    * @param {?} key The key to remove.
    * @return {boolean} Whether an element was removed.
    */
   Barge.Object.remove = function (obj, key)
   {
      var rv;
      if (rv = key in /** @type {!Object} */ (obj))
      {
         delete obj[key];
      }
      return rv;
   };

   /**
    * Adds a key-value pair to the object. Throws an exception if the key is
    * already in use. Use set if you want to change an existing pair.
    *
    * @param {Object<K,V>} obj The object to which to add the key-value pair.
    * @param {string} key The key to add.
    * @param {V} val The value to add.
    * @template K,V
    */
   Barge.Object.add = function (obj, key, val)
   {
      if (obj !== null && key in obj)
      {
         throw Error('The object already contains the key "' + key + '"');
      }
      Barge.Object.set(obj, key, val);
   };

   /**
    * Returns the value for the given key.
    *
    * @param {Object<K,V>} obj The object from which to get the value.
    * @param {string} key The key for which to get the value.
    * @param {R=} opt_val The value to return if no item is found for the given
    *     key (default is undefined).
    * @return {V|R|undefined} The value for the given key.
    * @template K,V,R
    */
   Barge.Object.get = function (obj, key, opt_val)
   {
      if (obj !== null && key in obj)
      {
         return obj[key];
      }
      return opt_val;
   };

   /**
    * Adds a key-value pair to the object/map/hash.
    *
    * @param {Object<K,V>} obj The object to which to add the key-value pair.
    * @param {string} key The key to add.
    * @param {V} value The value to add.
    * @template K,V
    */
   Barge.Object.set = function (obj, key, value)
   {
      obj[key] = value;
   };

   /**
    * Adds a key-value pair to the object/map/hash if it doesn't exist yet.
    *
    * @param {Object<K,V>} obj The object to which to add the key-value pair.
    * @param {string} key The key to add.
    * @param {V} value The value to add if the key wasn't present.
    * @return {V} The value of the entry at the end of the function.
    * @template K,V
    */
   Barge.Object.setIfUndefined = function (obj, key, value)
   {
      return key in /** @type {!Object} */ (obj) ? obj[key] : (obj[key] = value);
   };

   /**
    * Sets a key and value to an object if the key is not set. The value will be
    * the return value of the given function. If the key already exists, the
    * object will not be changed and the function will not be called (the function
    * will be lazily evaluated -- only called if necessary).
    *
    * This function is particularly useful for use with a map used a as a cache.
    *
    * @param {!Object<K,V>} obj The object to which to add the key-value pair.
    * @param {string} key The key to add.
    * @param {function():V} f The value to add if the key wasn't present.
    * @return {V} The value of the entry at the end of the function.
    * @template K,V
    */
   Barge.Object.setWithReturnValueIfNotSet = function (obj, key, f)
   {
      if (key in obj)
      {
         return obj[key];
      }

      var val = f();
      obj[key] = val;
      return val;
   };

   /**
    * Compares two objects for equality using === on the values.
    *
    * @param {!Object<K,V>} a
    * @param {!Object<K,V>} b
    * @return {boolean}
    * @template K,V
    */
   Barge.Object.equals = function (a, b)
   {
      for (var k in a)
      {
         if (!(k in b) || a[k] !== b[k])
         {
            return false;
         }
      }
      for (var k in b)
      {
         if (!(k in a))
         {
            return false;
         }
      }
      return true;
   };

   /**
    * Returns a shallow clone of the object.
    *
    * @param {Object<K,V>} obj Object to clone.
    * @return {!Object<K,V>} Clone of the input object.
    * @template K,V
    */
   Barge.Object.clone = function (obj)
   {
      // We cannot use the prototype trick because a lot of methods depend on where
      // the actual key is set.

      if (obj === null)
      {
         return null;
      }

      var res = {};
      for (var key in obj)
      {
         res[key] = obj[key];
      }
      return res;
      // We could also use Barge.mixin but I wanted this to be independent from that.
   };

   /**
    * Clones a value. The input may be an Object, Array, or basic type. Objects and
    * arrays will be cloned recursively.
    *
    * WARNINGS:
    * <code>Barge.Object.unsafeClone</code> does not detect reference loops. Objects
    * that refer to themselves will cause infinite recursion.
    *
    * <code>Barge.Object.unsafeClone</code> is unaware of unique identifiers, and
    * copies UIDs created by <code>getUid</code> into cloned results.
    *
    * @param {*} obj The value to clone.
    * @return {*} A clone of the input value.
    */
   Barge.Object.unsafeClone = function (obj)
   {
      var type = Barge.typeOf(obj);
      if (type == 'object' || type == 'array')
      {
         if (Barge.isFunction(obj.clone))
         {
            return obj.clone();
         }
         var clone = type == 'array' ? [] : {};
         for (var key in obj)
         {
            clone[key] = Barge.Object.unsafeClone(obj[key]);
         }
         return clone;
      }

      return obj;
   };

   /**
    * Returns a new object in which all the keys and values are interchanged
    * (keys become values and values become keys). If multiple keys map to the
    * same value, the chosen transposed value is implementation-dependent.
    *
    * @param {Object} obj The object to transpose.
    * @return {!Object} The transposed object.
    */
   Barge.Object.transpose = function (obj)
   {
      var transposed = {};
      for (var key in obj)
      {
         transposed[obj[key]] = key;
      }
      return transposed;
   };

   /**
    * The names of the fields that are defined on Object.prototype.
    * @type {Array<string>}
    * @private
    */
   Barge.Object.PROTOTYPE_FIELDS_ = [
      'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
      'toLocaleString', 'toString', 'valueOf'
   ];

   /**
    * Extends an object with another object.
    * This operates 'in-place'; it does not create a new Object.
    *
    * Example:
    * var o = {};
    * Barge.Object.extend(o, {a: 0, b: 1});
    * o; // {a: 0, b: 1}
    * Barge.Object.extend(o, {b: 2, c: 3});
    * o; // {a: 0, b: 2, c: 3}
    *
    * @param {Object} target The object to modify. Existing properties will be
    *     overwritten if they are also present in one of the objects in
    *     {@code var_args}.
    * @param {...Object} var_args The objects from which values will be copied.
    * @deprecated use{@link Barge.Object.extend | @link Barge.utils.extend } instead
    */
   Barge.Object.extendss = function (target, var_args)
   {
      var key, source;
      for (var i = 1; i < arguments.length; i++)
      {
         source = arguments[i];
         for (key in source)
         {
            target[key] = source[key];
         }

         // For IE the for-in-loop does not contain any properties that are not
         // enumerable on the prototype object (for example isPrototypeOf from
         // Object.prototype) and it will also not include 'replace' on objects that
         // extend String and change 'replace' (not that it is common for anyone to
         // extend anything except Object).

         for (var j = 0; j < Barge.Object.PROTOTYPE_FIELDS_.length; j++)
         {
            key = Barge.Object.PROTOTYPE_FIELDS_[j];
            if (Object.prototype.hasOwnProperty.call(source, key))
            {
               target[key] = source[key];
            }
         }
      }
   };

   Barge.Object.extend = Bu.extend;

   /*Barge.Object.extendClone = function (a, b)FIXME
   {
      Bu.extend(a, b)
   };*/

   /**
    * Creates a new object built from the key-value pairs provided as arguments.
    * @param {...*} var_args If only one argument is provided and it is an array
    *     then this is used as the arguments,  otherwise even arguments are used as
    *     the property names and odd arguments are used as the property values.
    * @return {!Object} The new object.
    * @throws {Error} If there are uneven number of arguments or there is only one
    *     non array argument.
    */
   Barge.Object.create = function (var_args)
   {
      var argLength = arguments.length;
      if (argLength === 1 && Barge.isArray(arguments[0]))
      {
         return Barge.Object.create.apply(null, arguments[0]);
      }

      if (argLength % 2)
      {
         throw Error('Uneven number of arguments');
      }

      var rv = {};
      for (var i = 0; i < argLength; i += 2)
      {
         rv[arguments[i]] = arguments[i + 1];
      }
      return rv;
   };

   /**
    * Ctor === Creator
    * @use mimics {@link Object.create}
    * @param prototype
    * @returns {Creator}
    */
   Barge.Object.createObject = function (prototype)
   {
      /**
       *
       * @constructor
       */
      function Creator() {}
      Creator.prototype = prototype;
      return new Creator();
   };

   /**
    * Creates a new object where the property names come from the arguments but
    * the value is always set to true
    * @param {...*} var_args If only one argument is provided and it is an array
    *     then this is used as the arguments,  otherwise the arguments are used
    *     as the property names.
    * @return {!Object} The new object.
    */
   Barge.Object.createSet = function (var_args)
   {
      var argLength = arguments.length;
      if (argLength === 1 && Barge.isArray(arguments[0]))
      {
         return Barge.Object.createSet.apply(null, arguments[0]);
      }

      var rv = {};
      for (var i = 0; i < argLength; i++)
      {
         rv[arguments[i]] = true;
      }
      return rv;
   };

   /**
    * Creates an immutable view of the underlying object, if the browser
    * supports immutable objects.
    *
    * In default mode, writes to this view will fail silently. In strict mode,
    * they will throw an error.
    *
    * @param {!Object<K,V>} obj An object.
    * @return {!Object<K,V>} An immutable view of that object, or the
    *     original object if this browser does not support immutables.
    * @template K,V
    */
   Barge.Object.createImmutableView = function (obj)
   {
      var result = obj;
      if (Object.isFrozen && !Object.isFrozen(obj))
      {
         result = Object.create(obj);
         Object.freeze(result);
      }
      return result;
   };

   /**
    * @param {!Object} obj An object.
    * @return {boolean} Whether this is an immutable view of the object.
    */
   Barge.Object.isImmutableView = function (obj)
   {
      return Object.isFrozen && Object.isFrozen(obj);
   };

})(Barge.utils);