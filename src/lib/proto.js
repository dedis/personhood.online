/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.stainless = (function() {
    
        /**
         * Namespace stainless.
         * @exports stainless
         * @namespace
         */
        var stainless = {};
    
        stainless.VerificationRequest = (function() {
    
            /**
             * Properties of a VerificationRequest.
             * @memberof stainless
             * @interface IVerificationRequest
             * @property {Object.<string,string>|null} [SourceFiles] VerificationRequest SourceFiles
             */
    
            /**
             * Constructs a new VerificationRequest.
             * @memberof stainless
             * @classdesc Represents a VerificationRequest.
             * @implements IVerificationRequest
             * @constructor
             * @param {stainless.IVerificationRequest=} [properties] Properties to set
             */
            function VerificationRequest(properties) {
                this.SourceFiles = {};
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * VerificationRequest SourceFiles.
             * @member {Object.<string,string>} SourceFiles
             * @memberof stainless.VerificationRequest
             * @instance
             */
            VerificationRequest.prototype.SourceFiles = $util.emptyObject;
    
            /**
             * Creates a new VerificationRequest instance using the specified properties.
             * @function create
             * @memberof stainless.VerificationRequest
             * @static
             * @param {stainless.IVerificationRequest=} [properties] Properties to set
             * @returns {stainless.VerificationRequest} VerificationRequest instance
             */
            VerificationRequest.create = function create(properties) {
                return new VerificationRequest(properties);
            };
    
            /**
             * Encodes the specified VerificationRequest message. Does not implicitly {@link stainless.VerificationRequest.verify|verify} messages.
             * @function encode
             * @memberof stainless.VerificationRequest
             * @static
             * @param {stainless.IVerificationRequest} message VerificationRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VerificationRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.SourceFiles != null && message.hasOwnProperty("SourceFiles"))
                    for (var keys = Object.keys(message.SourceFiles), i = 0; i < keys.length; ++i)
                        writer.uint32(/* id 101, wireType 2 =*/810).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.SourceFiles[keys[i]]).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified VerificationRequest message, length delimited. Does not implicitly {@link stainless.VerificationRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof stainless.VerificationRequest
             * @static
             * @param {stainless.IVerificationRequest} message VerificationRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VerificationRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a VerificationRequest message from the specified reader or buffer.
             * @function decode
             * @memberof stainless.VerificationRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {stainless.VerificationRequest} VerificationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VerificationRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.stainless.VerificationRequest(), key;
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 101:
                        reader.skip().pos++;
                        if (message.SourceFiles === $util.emptyObject)
                            message.SourceFiles = {};
                        key = reader.string();
                        reader.pos++;
                        message.SourceFiles[key] = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a VerificationRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof stainless.VerificationRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {stainless.VerificationRequest} VerificationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VerificationRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a VerificationRequest message.
             * @function verify
             * @memberof stainless.VerificationRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            VerificationRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.SourceFiles != null && message.hasOwnProperty("SourceFiles")) {
                    if (!$util.isObject(message.SourceFiles))
                        return "SourceFiles: object expected";
                    var key = Object.keys(message.SourceFiles);
                    for (var i = 0; i < key.length; ++i)
                        if (!$util.isString(message.SourceFiles[key[i]]))
                            return "SourceFiles: string{k:string} expected";
                }
                return null;
            };
    
            /**
             * Creates a VerificationRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof stainless.VerificationRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {stainless.VerificationRequest} VerificationRequest
             */
            VerificationRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.stainless.VerificationRequest)
                    return object;
                var message = new $root.stainless.VerificationRequest();
                if (object.SourceFiles) {
                    if (typeof object.SourceFiles !== "object")
                        throw TypeError(".stainless.VerificationRequest.SourceFiles: object expected");
                    message.SourceFiles = {};
                    for (var keys = Object.keys(object.SourceFiles), i = 0; i < keys.length; ++i)
                        message.SourceFiles[keys[i]] = String(object.SourceFiles[keys[i]]);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a VerificationRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof stainless.VerificationRequest
             * @static
             * @param {stainless.VerificationRequest} message VerificationRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            VerificationRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.objects || options.defaults)
                    object.SourceFiles = {};
                var keys2;
                if (message.SourceFiles && (keys2 = Object.keys(message.SourceFiles)).length) {
                    object.SourceFiles = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.SourceFiles[keys2[j]] = message.SourceFiles[keys2[j]];
                }
                return object;
            };
    
            /**
             * Converts this VerificationRequest to JSON.
             * @function toJSON
             * @memberof stainless.VerificationRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            VerificationRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return VerificationRequest;
        })();
    
        stainless.VerificationResponse = (function() {
    
            /**
             * Properties of a VerificationResponse.
             * @memberof stainless
             * @interface IVerificationResponse
             * @property {string|null} [Console] VerificationResponse Console
             * @property {string|null} [Report] VerificationResponse Report
             */
    
            /**
             * Constructs a new VerificationResponse.
             * @memberof stainless
             * @classdesc Represents a VerificationResponse.
             * @implements IVerificationResponse
             * @constructor
             * @param {stainless.IVerificationResponse=} [properties] Properties to set
             */
            function VerificationResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * VerificationResponse Console.
             * @member {string} Console
             * @memberof stainless.VerificationResponse
             * @instance
             */
            VerificationResponse.prototype.Console = "";
    
            /**
             * VerificationResponse Report.
             * @member {string} Report
             * @memberof stainless.VerificationResponse
             * @instance
             */
            VerificationResponse.prototype.Report = "";
    
            /**
             * Creates a new VerificationResponse instance using the specified properties.
             * @function create
             * @memberof stainless.VerificationResponse
             * @static
             * @param {stainless.IVerificationResponse=} [properties] Properties to set
             * @returns {stainless.VerificationResponse} VerificationResponse instance
             */
            VerificationResponse.create = function create(properties) {
                return new VerificationResponse(properties);
            };
    
            /**
             * Encodes the specified VerificationResponse message. Does not implicitly {@link stainless.VerificationResponse.verify|verify} messages.
             * @function encode
             * @memberof stainless.VerificationResponse
             * @static
             * @param {stainless.IVerificationResponse} message VerificationResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VerificationResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.Console != null && message.hasOwnProperty("Console"))
                    writer.uint32(/* id 101, wireType 2 =*/810).string(message.Console);
                if (message.Report != null && message.hasOwnProperty("Report"))
                    writer.uint32(/* id 102, wireType 2 =*/818).string(message.Report);
                return writer;
            };
    
            /**
             * Encodes the specified VerificationResponse message, length delimited. Does not implicitly {@link stainless.VerificationResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof stainless.VerificationResponse
             * @static
             * @param {stainless.IVerificationResponse} message VerificationResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            VerificationResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a VerificationResponse message from the specified reader or buffer.
             * @function decode
             * @memberof stainless.VerificationResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {stainless.VerificationResponse} VerificationResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VerificationResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.stainless.VerificationResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 101:
                        message.Console = reader.string();
                        break;
                    case 102:
                        message.Report = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a VerificationResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof stainless.VerificationResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {stainless.VerificationResponse} VerificationResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            VerificationResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a VerificationResponse message.
             * @function verify
             * @memberof stainless.VerificationResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            VerificationResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.Console != null && message.hasOwnProperty("Console"))
                    if (!$util.isString(message.Console))
                        return "Console: string expected";
                if (message.Report != null && message.hasOwnProperty("Report"))
                    if (!$util.isString(message.Report))
                        return "Report: string expected";
                return null;
            };
    
            /**
             * Creates a VerificationResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof stainless.VerificationResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {stainless.VerificationResponse} VerificationResponse
             */
            VerificationResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.stainless.VerificationResponse)
                    return object;
                var message = new $root.stainless.VerificationResponse();
                if (object.Console != null)
                    message.Console = String(object.Console);
                if (object.Report != null)
                    message.Report = String(object.Report);
                return message;
            };
    
            /**
             * Creates a plain object from a VerificationResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof stainless.VerificationResponse
             * @static
             * @param {stainless.VerificationResponse} message VerificationResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            VerificationResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.Console = "";
                    object.Report = "";
                }
                if (message.Console != null && message.hasOwnProperty("Console"))
                    object.Console = message.Console;
                if (message.Report != null && message.hasOwnProperty("Report"))
                    object.Report = message.Report;
                return object;
            };
    
            /**
             * Converts this VerificationResponse to JSON.
             * @function toJSON
             * @memberof stainless.VerificationResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            VerificationResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return VerificationResponse;
        })();
    
        stainless.BytecodeGenRequest = (function() {
    
            /**
             * Properties of a BytecodeGenRequest.
             * @memberof stainless
             * @interface IBytecodeGenRequest
             * @property {Object.<string,string>|null} [SourceFiles] BytecodeGenRequest SourceFiles
             */
    
            /**
             * Constructs a new BytecodeGenRequest.
             * @memberof stainless
             * @classdesc Represents a BytecodeGenRequest.
             * @implements IBytecodeGenRequest
             * @constructor
             * @param {stainless.IBytecodeGenRequest=} [properties] Properties to set
             */
            function BytecodeGenRequest(properties) {
                this.SourceFiles = {};
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * BytecodeGenRequest SourceFiles.
             * @member {Object.<string,string>} SourceFiles
             * @memberof stainless.BytecodeGenRequest
             * @instance
             */
            BytecodeGenRequest.prototype.SourceFiles = $util.emptyObject;
    
            /**
             * Creates a new BytecodeGenRequest instance using the specified properties.
             * @function create
             * @memberof stainless.BytecodeGenRequest
             * @static
             * @param {stainless.IBytecodeGenRequest=} [properties] Properties to set
             * @returns {stainless.BytecodeGenRequest} BytecodeGenRequest instance
             */
            BytecodeGenRequest.create = function create(properties) {
                return new BytecodeGenRequest(properties);
            };
    
            /**
             * Encodes the specified BytecodeGenRequest message. Does not implicitly {@link stainless.BytecodeGenRequest.verify|verify} messages.
             * @function encode
             * @memberof stainless.BytecodeGenRequest
             * @static
             * @param {stainless.IBytecodeGenRequest} message BytecodeGenRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytecodeGenRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.SourceFiles != null && message.hasOwnProperty("SourceFiles"))
                    for (var keys = Object.keys(message.SourceFiles), i = 0; i < keys.length; ++i)
                        writer.uint32(/* id 101, wireType 2 =*/810).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.SourceFiles[keys[i]]).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified BytecodeGenRequest message, length delimited. Does not implicitly {@link stainless.BytecodeGenRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof stainless.BytecodeGenRequest
             * @static
             * @param {stainless.IBytecodeGenRequest} message BytecodeGenRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytecodeGenRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a BytecodeGenRequest message from the specified reader or buffer.
             * @function decode
             * @memberof stainless.BytecodeGenRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {stainless.BytecodeGenRequest} BytecodeGenRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytecodeGenRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.stainless.BytecodeGenRequest(), key;
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 101:
                        reader.skip().pos++;
                        if (message.SourceFiles === $util.emptyObject)
                            message.SourceFiles = {};
                        key = reader.string();
                        reader.pos++;
                        message.SourceFiles[key] = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a BytecodeGenRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof stainless.BytecodeGenRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {stainless.BytecodeGenRequest} BytecodeGenRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytecodeGenRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a BytecodeGenRequest message.
             * @function verify
             * @memberof stainless.BytecodeGenRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BytecodeGenRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.SourceFiles != null && message.hasOwnProperty("SourceFiles")) {
                    if (!$util.isObject(message.SourceFiles))
                        return "SourceFiles: object expected";
                    var key = Object.keys(message.SourceFiles);
                    for (var i = 0; i < key.length; ++i)
                        if (!$util.isString(message.SourceFiles[key[i]]))
                            return "SourceFiles: string{k:string} expected";
                }
                return null;
            };
    
            /**
             * Creates a BytecodeGenRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof stainless.BytecodeGenRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {stainless.BytecodeGenRequest} BytecodeGenRequest
             */
            BytecodeGenRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.stainless.BytecodeGenRequest)
                    return object;
                var message = new $root.stainless.BytecodeGenRequest();
                if (object.SourceFiles) {
                    if (typeof object.SourceFiles !== "object")
                        throw TypeError(".stainless.BytecodeGenRequest.SourceFiles: object expected");
                    message.SourceFiles = {};
                    for (var keys = Object.keys(object.SourceFiles), i = 0; i < keys.length; ++i)
                        message.SourceFiles[keys[i]] = String(object.SourceFiles[keys[i]]);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a BytecodeGenRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof stainless.BytecodeGenRequest
             * @static
             * @param {stainless.BytecodeGenRequest} message BytecodeGenRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BytecodeGenRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.objects || options.defaults)
                    object.SourceFiles = {};
                var keys2;
                if (message.SourceFiles && (keys2 = Object.keys(message.SourceFiles)).length) {
                    object.SourceFiles = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.SourceFiles[keys2[j]] = message.SourceFiles[keys2[j]];
                }
                return object;
            };
    
            /**
             * Converts this BytecodeGenRequest to JSON.
             * @function toJSON
             * @memberof stainless.BytecodeGenRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BytecodeGenRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return BytecodeGenRequest;
        })();
    
        stainless.BytecodeObj = (function() {
    
            /**
             * Properties of a BytecodeObj.
             * @memberof stainless
             * @interface IBytecodeObj
             * @property {string|null} [Abi] BytecodeObj Abi
             * @property {string|null} [Bin] BytecodeObj Bin
             */
    
            /**
             * Constructs a new BytecodeObj.
             * @memberof stainless
             * @classdesc Represents a BytecodeObj.
             * @implements IBytecodeObj
             * @constructor
             * @param {stainless.IBytecodeObj=} [properties] Properties to set
             */
            function BytecodeObj(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * BytecodeObj Abi.
             * @member {string} Abi
             * @memberof stainless.BytecodeObj
             * @instance
             */
            BytecodeObj.prototype.Abi = "";
    
            /**
             * BytecodeObj Bin.
             * @member {string} Bin
             * @memberof stainless.BytecodeObj
             * @instance
             */
            BytecodeObj.prototype.Bin = "";
    
            /**
             * Creates a new BytecodeObj instance using the specified properties.
             * @function create
             * @memberof stainless.BytecodeObj
             * @static
             * @param {stainless.IBytecodeObj=} [properties] Properties to set
             * @returns {stainless.BytecodeObj} BytecodeObj instance
             */
            BytecodeObj.create = function create(properties) {
                return new BytecodeObj(properties);
            };
    
            /**
             * Encodes the specified BytecodeObj message. Does not implicitly {@link stainless.BytecodeObj.verify|verify} messages.
             * @function encode
             * @memberof stainless.BytecodeObj
             * @static
             * @param {stainless.IBytecodeObj} message BytecodeObj message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytecodeObj.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.Abi != null && message.hasOwnProperty("Abi"))
                    writer.uint32(/* id 101, wireType 2 =*/810).string(message.Abi);
                if (message.Bin != null && message.hasOwnProperty("Bin"))
                    writer.uint32(/* id 102, wireType 2 =*/818).string(message.Bin);
                return writer;
            };
    
            /**
             * Encodes the specified BytecodeObj message, length delimited. Does not implicitly {@link stainless.BytecodeObj.verify|verify} messages.
             * @function encodeDelimited
             * @memberof stainless.BytecodeObj
             * @static
             * @param {stainless.IBytecodeObj} message BytecodeObj message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytecodeObj.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a BytecodeObj message from the specified reader or buffer.
             * @function decode
             * @memberof stainless.BytecodeObj
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {stainless.BytecodeObj} BytecodeObj
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytecodeObj.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.stainless.BytecodeObj();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 101:
                        message.Abi = reader.string();
                        break;
                    case 102:
                        message.Bin = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a BytecodeObj message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof stainless.BytecodeObj
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {stainless.BytecodeObj} BytecodeObj
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytecodeObj.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a BytecodeObj message.
             * @function verify
             * @memberof stainless.BytecodeObj
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BytecodeObj.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.Abi != null && message.hasOwnProperty("Abi"))
                    if (!$util.isString(message.Abi))
                        return "Abi: string expected";
                if (message.Bin != null && message.hasOwnProperty("Bin"))
                    if (!$util.isString(message.Bin))
                        return "Bin: string expected";
                return null;
            };
    
            /**
             * Creates a BytecodeObj message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof stainless.BytecodeObj
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {stainless.BytecodeObj} BytecodeObj
             */
            BytecodeObj.fromObject = function fromObject(object) {
                if (object instanceof $root.stainless.BytecodeObj)
                    return object;
                var message = new $root.stainless.BytecodeObj();
                if (object.Abi != null)
                    message.Abi = String(object.Abi);
                if (object.Bin != null)
                    message.Bin = String(object.Bin);
                return message;
            };
    
            /**
             * Creates a plain object from a BytecodeObj message. Also converts values to other types if specified.
             * @function toObject
             * @memberof stainless.BytecodeObj
             * @static
             * @param {stainless.BytecodeObj} message BytecodeObj
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BytecodeObj.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.Abi = "";
                    object.Bin = "";
                }
                if (message.Abi != null && message.hasOwnProperty("Abi"))
                    object.Abi = message.Abi;
                if (message.Bin != null && message.hasOwnProperty("Bin"))
                    object.Bin = message.Bin;
                return object;
            };
    
            /**
             * Converts this BytecodeObj to JSON.
             * @function toJSON
             * @memberof stainless.BytecodeObj
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BytecodeObj.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return BytecodeObj;
        })();
    
        stainless.BytecodeGenResponse = (function() {
    
            /**
             * Properties of a BytecodeGenResponse.
             * @memberof stainless
             * @interface IBytecodeGenResponse
             * @property {Object.<string,stainless.IBytecodeObj>|null} [BytecodeObjs] BytecodeGenResponse BytecodeObjs
             */
    
            /**
             * Constructs a new BytecodeGenResponse.
             * @memberof stainless
             * @classdesc Represents a BytecodeGenResponse.
             * @implements IBytecodeGenResponse
             * @constructor
             * @param {stainless.IBytecodeGenResponse=} [properties] Properties to set
             */
            function BytecodeGenResponse(properties) {
                this.BytecodeObjs = {};
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * BytecodeGenResponse BytecodeObjs.
             * @member {Object.<string,stainless.IBytecodeObj>} BytecodeObjs
             * @memberof stainless.BytecodeGenResponse
             * @instance
             */
            BytecodeGenResponse.prototype.BytecodeObjs = $util.emptyObject;
    
            /**
             * Creates a new BytecodeGenResponse instance using the specified properties.
             * @function create
             * @memberof stainless.BytecodeGenResponse
             * @static
             * @param {stainless.IBytecodeGenResponse=} [properties] Properties to set
             * @returns {stainless.BytecodeGenResponse} BytecodeGenResponse instance
             */
            BytecodeGenResponse.create = function create(properties) {
                return new BytecodeGenResponse(properties);
            };
    
            /**
             * Encodes the specified BytecodeGenResponse message. Does not implicitly {@link stainless.BytecodeGenResponse.verify|verify} messages.
             * @function encode
             * @memberof stainless.BytecodeGenResponse
             * @static
             * @param {stainless.IBytecodeGenResponse} message BytecodeGenResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytecodeGenResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.BytecodeObjs != null && message.hasOwnProperty("BytecodeObjs"))
                    for (var keys = Object.keys(message.BytecodeObjs), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 101, wireType 2 =*/810).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.stainless.BytecodeObj.encode(message.BytecodeObjs[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                return writer;
            };
    
            /**
             * Encodes the specified BytecodeGenResponse message, length delimited. Does not implicitly {@link stainless.BytecodeGenResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof stainless.BytecodeGenResponse
             * @static
             * @param {stainless.IBytecodeGenResponse} message BytecodeGenResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytecodeGenResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a BytecodeGenResponse message from the specified reader or buffer.
             * @function decode
             * @memberof stainless.BytecodeGenResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {stainless.BytecodeGenResponse} BytecodeGenResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytecodeGenResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.stainless.BytecodeGenResponse(), key;
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 101:
                        reader.skip().pos++;
                        if (message.BytecodeObjs === $util.emptyObject)
                            message.BytecodeObjs = {};
                        key = reader.string();
                        reader.pos++;
                        message.BytecodeObjs[key] = $root.stainless.BytecodeObj.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a BytecodeGenResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof stainless.BytecodeGenResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {stainless.BytecodeGenResponse} BytecodeGenResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytecodeGenResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a BytecodeGenResponse message.
             * @function verify
             * @memberof stainless.BytecodeGenResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BytecodeGenResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.BytecodeObjs != null && message.hasOwnProperty("BytecodeObjs")) {
                    if (!$util.isObject(message.BytecodeObjs))
                        return "BytecodeObjs: object expected";
                    var key = Object.keys(message.BytecodeObjs);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.stainless.BytecodeObj.verify(message.BytecodeObjs[key[i]]);
                        if (error)
                            return "BytecodeObjs." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a BytecodeGenResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof stainless.BytecodeGenResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {stainless.BytecodeGenResponse} BytecodeGenResponse
             */
            BytecodeGenResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.stainless.BytecodeGenResponse)
                    return object;
                var message = new $root.stainless.BytecodeGenResponse();
                if (object.BytecodeObjs) {
                    if (typeof object.BytecodeObjs !== "object")
                        throw TypeError(".stainless.BytecodeGenResponse.BytecodeObjs: object expected");
                    message.BytecodeObjs = {};
                    for (var keys = Object.keys(object.BytecodeObjs), i = 0; i < keys.length; ++i) {
                        if (typeof object.BytecodeObjs[keys[i]] !== "object")
                            throw TypeError(".stainless.BytecodeGenResponse.BytecodeObjs: object expected");
                        message.BytecodeObjs[keys[i]] = $root.stainless.BytecodeObj.fromObject(object.BytecodeObjs[keys[i]]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a BytecodeGenResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof stainless.BytecodeGenResponse
             * @static
             * @param {stainless.BytecodeGenResponse} message BytecodeGenResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BytecodeGenResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.objects || options.defaults)
                    object.BytecodeObjs = {};
                var keys2;
                if (message.BytecodeObjs && (keys2 = Object.keys(message.BytecodeObjs)).length) {
                    object.BytecodeObjs = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.BytecodeObjs[keys2[j]] = $root.stainless.BytecodeObj.toObject(message.BytecodeObjs[keys2[j]], options);
                }
                return object;
            };
    
            /**
             * Converts this BytecodeGenResponse to JSON.
             * @function toJSON
             * @memberof stainless.BytecodeGenResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BytecodeGenResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return BytecodeGenResponse;
        })();
    
        stainless.DeployRequest = (function() {
    
            /**
             * Properties of a DeployRequest.
             * @memberof stainless
             * @interface IDeployRequest
             * @property {number|Long|null} [GasLimit] DeployRequest GasLimit
             * @property {number|Long|null} [GasPrice] DeployRequest GasPrice
             * @property {number|Long|null} [Amount] DeployRequest Amount
             * @property {number|Long|null} [Nonce] DeployRequest Nonce
             * @property {Uint8Array|null} [Bytecode] DeployRequest Bytecode
             * @property {string|null} [Abi] DeployRequest Abi
             * @property {Array.<string>|null} [Args] DeployRequest Args
             */
    
            /**
             * Constructs a new DeployRequest.
             * @memberof stainless
             * @classdesc Represents a DeployRequest.
             * @implements IDeployRequest
             * @constructor
             * @param {stainless.IDeployRequest=} [properties] Properties to set
             */
            function DeployRequest(properties) {
                this.Args = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * DeployRequest GasLimit.
             * @member {number|Long} GasLimit
             * @memberof stainless.DeployRequest
             * @instance
             */
            DeployRequest.prototype.GasLimit = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * DeployRequest GasPrice.
             * @member {number|Long} GasPrice
             * @memberof stainless.DeployRequest
             * @instance
             */
            DeployRequest.prototype.GasPrice = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * DeployRequest Amount.
             * @member {number|Long} Amount
             * @memberof stainless.DeployRequest
             * @instance
             */
            DeployRequest.prototype.Amount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * DeployRequest Nonce.
             * @member {number|Long} Nonce
             * @memberof stainless.DeployRequest
             * @instance
             */
            DeployRequest.prototype.Nonce = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * DeployRequest Bytecode.
             * @member {Uint8Array} Bytecode
             * @memberof stainless.DeployRequest
             * @instance
             */
            DeployRequest.prototype.Bytecode = $util.newBuffer([]);
    
            /**
             * DeployRequest Abi.
             * @member {string} Abi
             * @memberof stainless.DeployRequest
             * @instance
             */
            DeployRequest.prototype.Abi = "";
    
            /**
             * DeployRequest Args.
             * @member {Array.<string>} Args
             * @memberof stainless.DeployRequest
             * @instance
             */
            DeployRequest.prototype.Args = $util.emptyArray;
    
            /**
             * Creates a new DeployRequest instance using the specified properties.
             * @function create
             * @memberof stainless.DeployRequest
             * @static
             * @param {stainless.IDeployRequest=} [properties] Properties to set
             * @returns {stainless.DeployRequest} DeployRequest instance
             */
            DeployRequest.create = function create(properties) {
                return new DeployRequest(properties);
            };
    
            /**
             * Encodes the specified DeployRequest message. Does not implicitly {@link stainless.DeployRequest.verify|verify} messages.
             * @function encode
             * @memberof stainless.DeployRequest
             * @static
             * @param {stainless.IDeployRequest} message DeployRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeployRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.GasLimit != null && message.hasOwnProperty("GasLimit"))
                    writer.uint32(/* id 101, wireType 0 =*/808).uint64(message.GasLimit);
                if (message.GasPrice != null && message.hasOwnProperty("GasPrice"))
                    writer.uint32(/* id 102, wireType 0 =*/816).uint64(message.GasPrice);
                if (message.Amount != null && message.hasOwnProperty("Amount"))
                    writer.uint32(/* id 103, wireType 0 =*/824).uint64(message.Amount);
                if (message.Nonce != null && message.hasOwnProperty("Nonce"))
                    writer.uint32(/* id 104, wireType 0 =*/832).uint64(message.Nonce);
                if (message.Bytecode != null && message.hasOwnProperty("Bytecode"))
                    writer.uint32(/* id 105, wireType 2 =*/842).bytes(message.Bytecode);
                if (message.Abi != null && message.hasOwnProperty("Abi"))
                    writer.uint32(/* id 106, wireType 2 =*/850).string(message.Abi);
                if (message.Args != null && message.Args.length)
                    for (var i = 0; i < message.Args.length; ++i)
                        writer.uint32(/* id 107, wireType 2 =*/858).string(message.Args[i]);
                return writer;
            };
    
            /**
             * Encodes the specified DeployRequest message, length delimited. Does not implicitly {@link stainless.DeployRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof stainless.DeployRequest
             * @static
             * @param {stainless.IDeployRequest} message DeployRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeployRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a DeployRequest message from the specified reader or buffer.
             * @function decode
             * @memberof stainless.DeployRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {stainless.DeployRequest} DeployRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeployRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.stainless.DeployRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 101:
                        message.GasLimit = reader.uint64();
                        break;
                    case 102:
                        message.GasPrice = reader.uint64();
                        break;
                    case 103:
                        message.Amount = reader.uint64();
                        break;
                    case 104:
                        message.Nonce = reader.uint64();
                        break;
                    case 105:
                        message.Bytecode = reader.bytes();
                        break;
                    case 106:
                        message.Abi = reader.string();
                        break;
                    case 107:
                        if (!(message.Args && message.Args.length))
                            message.Args = [];
                        message.Args.push(reader.string());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a DeployRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof stainless.DeployRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {stainless.DeployRequest} DeployRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeployRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a DeployRequest message.
             * @function verify
             * @memberof stainless.DeployRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeployRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.GasLimit != null && message.hasOwnProperty("GasLimit"))
                    if (!$util.isInteger(message.GasLimit) && !(message.GasLimit && $util.isInteger(message.GasLimit.low) && $util.isInteger(message.GasLimit.high)))
                        return "GasLimit: integer|Long expected";
                if (message.GasPrice != null && message.hasOwnProperty("GasPrice"))
                    if (!$util.isInteger(message.GasPrice) && !(message.GasPrice && $util.isInteger(message.GasPrice.low) && $util.isInteger(message.GasPrice.high)))
                        return "GasPrice: integer|Long expected";
                if (message.Amount != null && message.hasOwnProperty("Amount"))
                    if (!$util.isInteger(message.Amount) && !(message.Amount && $util.isInteger(message.Amount.low) && $util.isInteger(message.Amount.high)))
                        return "Amount: integer|Long expected";
                if (message.Nonce != null && message.hasOwnProperty("Nonce"))
                    if (!$util.isInteger(message.Nonce) && !(message.Nonce && $util.isInteger(message.Nonce.low) && $util.isInteger(message.Nonce.high)))
                        return "Nonce: integer|Long expected";
                if (message.Bytecode != null && message.hasOwnProperty("Bytecode"))
                    if (!(message.Bytecode && typeof message.Bytecode.length === "number" || $util.isString(message.Bytecode)))
                        return "Bytecode: buffer expected";
                if (message.Abi != null && message.hasOwnProperty("Abi"))
                    if (!$util.isString(message.Abi))
                        return "Abi: string expected";
                if (message.Args != null && message.hasOwnProperty("Args")) {
                    if (!Array.isArray(message.Args))
                        return "Args: array expected";
                    for (var i = 0; i < message.Args.length; ++i)
                        if (!$util.isString(message.Args[i]))
                            return "Args: string[] expected";
                }
                return null;
            };
    
            /**
             * Creates a DeployRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof stainless.DeployRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {stainless.DeployRequest} DeployRequest
             */
            DeployRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.stainless.DeployRequest)
                    return object;
                var message = new $root.stainless.DeployRequest();
                if (object.GasLimit != null)
                    if ($util.Long)
                        (message.GasLimit = $util.Long.fromValue(object.GasLimit)).unsigned = true;
                    else if (typeof object.GasLimit === "string")
                        message.GasLimit = parseInt(object.GasLimit, 10);
                    else if (typeof object.GasLimit === "number")
                        message.GasLimit = object.GasLimit;
                    else if (typeof object.GasLimit === "object")
                        message.GasLimit = new $util.LongBits(object.GasLimit.low >>> 0, object.GasLimit.high >>> 0).toNumber(true);
                if (object.GasPrice != null)
                    if ($util.Long)
                        (message.GasPrice = $util.Long.fromValue(object.GasPrice)).unsigned = true;
                    else if (typeof object.GasPrice === "string")
                        message.GasPrice = parseInt(object.GasPrice, 10);
                    else if (typeof object.GasPrice === "number")
                        message.GasPrice = object.GasPrice;
                    else if (typeof object.GasPrice === "object")
                        message.GasPrice = new $util.LongBits(object.GasPrice.low >>> 0, object.GasPrice.high >>> 0).toNumber(true);
                if (object.Amount != null)
                    if ($util.Long)
                        (message.Amount = $util.Long.fromValue(object.Amount)).unsigned = true;
                    else if (typeof object.Amount === "string")
                        message.Amount = parseInt(object.Amount, 10);
                    else if (typeof object.Amount === "number")
                        message.Amount = object.Amount;
                    else if (typeof object.Amount === "object")
                        message.Amount = new $util.LongBits(object.Amount.low >>> 0, object.Amount.high >>> 0).toNumber(true);
                if (object.Nonce != null)
                    if ($util.Long)
                        (message.Nonce = $util.Long.fromValue(object.Nonce)).unsigned = true;
                    else if (typeof object.Nonce === "string")
                        message.Nonce = parseInt(object.Nonce, 10);
                    else if (typeof object.Nonce === "number")
                        message.Nonce = object.Nonce;
                    else if (typeof object.Nonce === "object")
                        message.Nonce = new $util.LongBits(object.Nonce.low >>> 0, object.Nonce.high >>> 0).toNumber(true);
                if (object.Bytecode != null)
                    if (typeof object.Bytecode === "string")
                        $util.base64.decode(object.Bytecode, message.Bytecode = $util.newBuffer($util.base64.length(object.Bytecode)), 0);
                    else if (object.Bytecode.length)
                        message.Bytecode = object.Bytecode;
                if (object.Abi != null)
                    message.Abi = String(object.Abi);
                if (object.Args) {
                    if (!Array.isArray(object.Args))
                        throw TypeError(".stainless.DeployRequest.Args: array expected");
                    message.Args = [];
                    for (var i = 0; i < object.Args.length; ++i)
                        message.Args[i] = String(object.Args[i]);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a DeployRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof stainless.DeployRequest
             * @static
             * @param {stainless.DeployRequest} message DeployRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeployRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.Args = [];
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.GasLimit = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.GasLimit = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.GasPrice = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.GasPrice = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.Amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.Amount = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.Nonce = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.Nonce = options.longs === String ? "0" : 0;
                    if (options.bytes === String)
                        object.Bytecode = "";
                    else {
                        object.Bytecode = [];
                        if (options.bytes !== Array)
                            object.Bytecode = $util.newBuffer(object.Bytecode);
                    }
                    object.Abi = "";
                }
                if (message.GasLimit != null && message.hasOwnProperty("GasLimit"))
                    if (typeof message.GasLimit === "number")
                        object.GasLimit = options.longs === String ? String(message.GasLimit) : message.GasLimit;
                    else
                        object.GasLimit = options.longs === String ? $util.Long.prototype.toString.call(message.GasLimit) : options.longs === Number ? new $util.LongBits(message.GasLimit.low >>> 0, message.GasLimit.high >>> 0).toNumber(true) : message.GasLimit;
                if (message.GasPrice != null && message.hasOwnProperty("GasPrice"))
                    if (typeof message.GasPrice === "number")
                        object.GasPrice = options.longs === String ? String(message.GasPrice) : message.GasPrice;
                    else
                        object.GasPrice = options.longs === String ? $util.Long.prototype.toString.call(message.GasPrice) : options.longs === Number ? new $util.LongBits(message.GasPrice.low >>> 0, message.GasPrice.high >>> 0).toNumber(true) : message.GasPrice;
                if (message.Amount != null && message.hasOwnProperty("Amount"))
                    if (typeof message.Amount === "number")
                        object.Amount = options.longs === String ? String(message.Amount) : message.Amount;
                    else
                        object.Amount = options.longs === String ? $util.Long.prototype.toString.call(message.Amount) : options.longs === Number ? new $util.LongBits(message.Amount.low >>> 0, message.Amount.high >>> 0).toNumber(true) : message.Amount;
                if (message.Nonce != null && message.hasOwnProperty("Nonce"))
                    if (typeof message.Nonce === "number")
                        object.Nonce = options.longs === String ? String(message.Nonce) : message.Nonce;
                    else
                        object.Nonce = options.longs === String ? $util.Long.prototype.toString.call(message.Nonce) : options.longs === Number ? new $util.LongBits(message.Nonce.low >>> 0, message.Nonce.high >>> 0).toNumber(true) : message.Nonce;
                if (message.Bytecode != null && message.hasOwnProperty("Bytecode"))
                    object.Bytecode = options.bytes === String ? $util.base64.encode(message.Bytecode, 0, message.Bytecode.length) : options.bytes === Array ? Array.prototype.slice.call(message.Bytecode) : message.Bytecode;
                if (message.Abi != null && message.hasOwnProperty("Abi"))
                    object.Abi = message.Abi;
                if (message.Args && message.Args.length) {
                    object.Args = [];
                    for (var j = 0; j < message.Args.length; ++j)
                        object.Args[j] = message.Args[j];
                }
                return object;
            };
    
            /**
             * Converts this DeployRequest to JSON.
             * @function toJSON
             * @memberof stainless.DeployRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeployRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return DeployRequest;
        })();
    
        stainless.TransactionRequest = (function() {
    
            /**
             * Properties of a TransactionRequest.
             * @memberof stainless
             * @interface ITransactionRequest
             * @property {number|Long|null} [GasLimit] TransactionRequest GasLimit
             * @property {number|Long|null} [GasPrice] TransactionRequest GasPrice
             * @property {number|Long|null} [Amount] TransactionRequest Amount
             * @property {Uint8Array|null} [ContractAddress] TransactionRequest ContractAddress
             * @property {number|Long|null} [Nonce] TransactionRequest Nonce
             * @property {string|null} [Abi] TransactionRequest Abi
             * @property {string|null} [Method] TransactionRequest Method
             * @property {Array.<string>|null} [Args] TransactionRequest Args
             */
    
            /**
             * Constructs a new TransactionRequest.
             * @memberof stainless
             * @classdesc Represents a TransactionRequest.
             * @implements ITransactionRequest
             * @constructor
             * @param {stainless.ITransactionRequest=} [properties] Properties to set
             */
            function TransactionRequest(properties) {
                this.Args = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * TransactionRequest GasLimit.
             * @member {number|Long} GasLimit
             * @memberof stainless.TransactionRequest
             * @instance
             */
            TransactionRequest.prototype.GasLimit = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * TransactionRequest GasPrice.
             * @member {number|Long} GasPrice
             * @memberof stainless.TransactionRequest
             * @instance
             */
            TransactionRequest.prototype.GasPrice = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * TransactionRequest Amount.
             * @member {number|Long} Amount
             * @memberof stainless.TransactionRequest
             * @instance
             */
            TransactionRequest.prototype.Amount = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * TransactionRequest ContractAddress.
             * @member {Uint8Array} ContractAddress
             * @memberof stainless.TransactionRequest
             * @instance
             */
            TransactionRequest.prototype.ContractAddress = $util.newBuffer([]);
    
            /**
             * TransactionRequest Nonce.
             * @member {number|Long} Nonce
             * @memberof stainless.TransactionRequest
             * @instance
             */
            TransactionRequest.prototype.Nonce = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
            /**
             * TransactionRequest Abi.
             * @member {string} Abi
             * @memberof stainless.TransactionRequest
             * @instance
             */
            TransactionRequest.prototype.Abi = "";
    
            /**
             * TransactionRequest Method.
             * @member {string} Method
             * @memberof stainless.TransactionRequest
             * @instance
             */
            TransactionRequest.prototype.Method = "";
    
            /**
             * TransactionRequest Args.
             * @member {Array.<string>} Args
             * @memberof stainless.TransactionRequest
             * @instance
             */
            TransactionRequest.prototype.Args = $util.emptyArray;
    
            /**
             * Creates a new TransactionRequest instance using the specified properties.
             * @function create
             * @memberof stainless.TransactionRequest
             * @static
             * @param {stainless.ITransactionRequest=} [properties] Properties to set
             * @returns {stainless.TransactionRequest} TransactionRequest instance
             */
            TransactionRequest.create = function create(properties) {
                return new TransactionRequest(properties);
            };
    
            /**
             * Encodes the specified TransactionRequest message. Does not implicitly {@link stainless.TransactionRequest.verify|verify} messages.
             * @function encode
             * @memberof stainless.TransactionRequest
             * @static
             * @param {stainless.ITransactionRequest} message TransactionRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TransactionRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.GasLimit != null && message.hasOwnProperty("GasLimit"))
                    writer.uint32(/* id 101, wireType 0 =*/808).uint64(message.GasLimit);
                if (message.GasPrice != null && message.hasOwnProperty("GasPrice"))
                    writer.uint32(/* id 102, wireType 0 =*/816).uint64(message.GasPrice);
                if (message.Amount != null && message.hasOwnProperty("Amount"))
                    writer.uint32(/* id 103, wireType 0 =*/824).uint64(message.Amount);
                if (message.ContractAddress != null && message.hasOwnProperty("ContractAddress"))
                    writer.uint32(/* id 104, wireType 2 =*/834).bytes(message.ContractAddress);
                if (message.Nonce != null && message.hasOwnProperty("Nonce"))
                    writer.uint32(/* id 105, wireType 0 =*/840).uint64(message.Nonce);
                if (message.Abi != null && message.hasOwnProperty("Abi"))
                    writer.uint32(/* id 106, wireType 2 =*/850).string(message.Abi);
                if (message.Method != null && message.hasOwnProperty("Method"))
                    writer.uint32(/* id 107, wireType 2 =*/858).string(message.Method);
                if (message.Args != null && message.Args.length)
                    for (var i = 0; i < message.Args.length; ++i)
                        writer.uint32(/* id 108, wireType 2 =*/866).string(message.Args[i]);
                return writer;
            };
    
            /**
             * Encodes the specified TransactionRequest message, length delimited. Does not implicitly {@link stainless.TransactionRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof stainless.TransactionRequest
             * @static
             * @param {stainless.ITransactionRequest} message TransactionRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TransactionRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a TransactionRequest message from the specified reader or buffer.
             * @function decode
             * @memberof stainless.TransactionRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {stainless.TransactionRequest} TransactionRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TransactionRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.stainless.TransactionRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 101:
                        message.GasLimit = reader.uint64();
                        break;
                    case 102:
                        message.GasPrice = reader.uint64();
                        break;
                    case 103:
                        message.Amount = reader.uint64();
                        break;
                    case 104:
                        message.ContractAddress = reader.bytes();
                        break;
                    case 105:
                        message.Nonce = reader.uint64();
                        break;
                    case 106:
                        message.Abi = reader.string();
                        break;
                    case 107:
                        message.Method = reader.string();
                        break;
                    case 108:
                        if (!(message.Args && message.Args.length))
                            message.Args = [];
                        message.Args.push(reader.string());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a TransactionRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof stainless.TransactionRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {stainless.TransactionRequest} TransactionRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TransactionRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a TransactionRequest message.
             * @function verify
             * @memberof stainless.TransactionRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TransactionRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.GasLimit != null && message.hasOwnProperty("GasLimit"))
                    if (!$util.isInteger(message.GasLimit) && !(message.GasLimit && $util.isInteger(message.GasLimit.low) && $util.isInteger(message.GasLimit.high)))
                        return "GasLimit: integer|Long expected";
                if (message.GasPrice != null && message.hasOwnProperty("GasPrice"))
                    if (!$util.isInteger(message.GasPrice) && !(message.GasPrice && $util.isInteger(message.GasPrice.low) && $util.isInteger(message.GasPrice.high)))
                        return "GasPrice: integer|Long expected";
                if (message.Amount != null && message.hasOwnProperty("Amount"))
                    if (!$util.isInteger(message.Amount) && !(message.Amount && $util.isInteger(message.Amount.low) && $util.isInteger(message.Amount.high)))
                        return "Amount: integer|Long expected";
                if (message.ContractAddress != null && message.hasOwnProperty("ContractAddress"))
                    if (!(message.ContractAddress && typeof message.ContractAddress.length === "number" || $util.isString(message.ContractAddress)))
                        return "ContractAddress: buffer expected";
                if (message.Nonce != null && message.hasOwnProperty("Nonce"))
                    if (!$util.isInteger(message.Nonce) && !(message.Nonce && $util.isInteger(message.Nonce.low) && $util.isInteger(message.Nonce.high)))
                        return "Nonce: integer|Long expected";
                if (message.Abi != null && message.hasOwnProperty("Abi"))
                    if (!$util.isString(message.Abi))
                        return "Abi: string expected";
                if (message.Method != null && message.hasOwnProperty("Method"))
                    if (!$util.isString(message.Method))
                        return "Method: string expected";
                if (message.Args != null && message.hasOwnProperty("Args")) {
                    if (!Array.isArray(message.Args))
                        return "Args: array expected";
                    for (var i = 0; i < message.Args.length; ++i)
                        if (!$util.isString(message.Args[i]))
                            return "Args: string[] expected";
                }
                return null;
            };
    
            /**
             * Creates a TransactionRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof stainless.TransactionRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {stainless.TransactionRequest} TransactionRequest
             */
            TransactionRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.stainless.TransactionRequest)
                    return object;
                var message = new $root.stainless.TransactionRequest();
                if (object.GasLimit != null)
                    if ($util.Long)
                        (message.GasLimit = $util.Long.fromValue(object.GasLimit)).unsigned = true;
                    else if (typeof object.GasLimit === "string")
                        message.GasLimit = parseInt(object.GasLimit, 10);
                    else if (typeof object.GasLimit === "number")
                        message.GasLimit = object.GasLimit;
                    else if (typeof object.GasLimit === "object")
                        message.GasLimit = new $util.LongBits(object.GasLimit.low >>> 0, object.GasLimit.high >>> 0).toNumber(true);
                if (object.GasPrice != null)
                    if ($util.Long)
                        (message.GasPrice = $util.Long.fromValue(object.GasPrice)).unsigned = true;
                    else if (typeof object.GasPrice === "string")
                        message.GasPrice = parseInt(object.GasPrice, 10);
                    else if (typeof object.GasPrice === "number")
                        message.GasPrice = object.GasPrice;
                    else if (typeof object.GasPrice === "object")
                        message.GasPrice = new $util.LongBits(object.GasPrice.low >>> 0, object.GasPrice.high >>> 0).toNumber(true);
                if (object.Amount != null)
                    if ($util.Long)
                        (message.Amount = $util.Long.fromValue(object.Amount)).unsigned = true;
                    else if (typeof object.Amount === "string")
                        message.Amount = parseInt(object.Amount, 10);
                    else if (typeof object.Amount === "number")
                        message.Amount = object.Amount;
                    else if (typeof object.Amount === "object")
                        message.Amount = new $util.LongBits(object.Amount.low >>> 0, object.Amount.high >>> 0).toNumber(true);
                if (object.ContractAddress != null)
                    if (typeof object.ContractAddress === "string")
                        $util.base64.decode(object.ContractAddress, message.ContractAddress = $util.newBuffer($util.base64.length(object.ContractAddress)), 0);
                    else if (object.ContractAddress.length)
                        message.ContractAddress = object.ContractAddress;
                if (object.Nonce != null)
                    if ($util.Long)
                        (message.Nonce = $util.Long.fromValue(object.Nonce)).unsigned = true;
                    else if (typeof object.Nonce === "string")
                        message.Nonce = parseInt(object.Nonce, 10);
                    else if (typeof object.Nonce === "number")
                        message.Nonce = object.Nonce;
                    else if (typeof object.Nonce === "object")
                        message.Nonce = new $util.LongBits(object.Nonce.low >>> 0, object.Nonce.high >>> 0).toNumber(true);
                if (object.Abi != null)
                    message.Abi = String(object.Abi);
                if (object.Method != null)
                    message.Method = String(object.Method);
                if (object.Args) {
                    if (!Array.isArray(object.Args))
                        throw TypeError(".stainless.TransactionRequest.Args: array expected");
                    message.Args = [];
                    for (var i = 0; i < object.Args.length; ++i)
                        message.Args[i] = String(object.Args[i]);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a TransactionRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof stainless.TransactionRequest
             * @static
             * @param {stainless.TransactionRequest} message TransactionRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TransactionRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.Args = [];
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.GasLimit = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.GasLimit = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.GasPrice = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.GasPrice = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.Amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.Amount = options.longs === String ? "0" : 0;
                    if (options.bytes === String)
                        object.ContractAddress = "";
                    else {
                        object.ContractAddress = [];
                        if (options.bytes !== Array)
                            object.ContractAddress = $util.newBuffer(object.ContractAddress);
                    }
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.Nonce = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.Nonce = options.longs === String ? "0" : 0;
                    object.Abi = "";
                    object.Method = "";
                }
                if (message.GasLimit != null && message.hasOwnProperty("GasLimit"))
                    if (typeof message.GasLimit === "number")
                        object.GasLimit = options.longs === String ? String(message.GasLimit) : message.GasLimit;
                    else
                        object.GasLimit = options.longs === String ? $util.Long.prototype.toString.call(message.GasLimit) : options.longs === Number ? new $util.LongBits(message.GasLimit.low >>> 0, message.GasLimit.high >>> 0).toNumber(true) : message.GasLimit;
                if (message.GasPrice != null && message.hasOwnProperty("GasPrice"))
                    if (typeof message.GasPrice === "number")
                        object.GasPrice = options.longs === String ? String(message.GasPrice) : message.GasPrice;
                    else
                        object.GasPrice = options.longs === String ? $util.Long.prototype.toString.call(message.GasPrice) : options.longs === Number ? new $util.LongBits(message.GasPrice.low >>> 0, message.GasPrice.high >>> 0).toNumber(true) : message.GasPrice;
                if (message.Amount != null && message.hasOwnProperty("Amount"))
                    if (typeof message.Amount === "number")
                        object.Amount = options.longs === String ? String(message.Amount) : message.Amount;
                    else
                        object.Amount = options.longs === String ? $util.Long.prototype.toString.call(message.Amount) : options.longs === Number ? new $util.LongBits(message.Amount.low >>> 0, message.Amount.high >>> 0).toNumber(true) : message.Amount;
                if (message.ContractAddress != null && message.hasOwnProperty("ContractAddress"))
                    object.ContractAddress = options.bytes === String ? $util.base64.encode(message.ContractAddress, 0, message.ContractAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.ContractAddress) : message.ContractAddress;
                if (message.Nonce != null && message.hasOwnProperty("Nonce"))
                    if (typeof message.Nonce === "number")
                        object.Nonce = options.longs === String ? String(message.Nonce) : message.Nonce;
                    else
                        object.Nonce = options.longs === String ? $util.Long.prototype.toString.call(message.Nonce) : options.longs === Number ? new $util.LongBits(message.Nonce.low >>> 0, message.Nonce.high >>> 0).toNumber(true) : message.Nonce;
                if (message.Abi != null && message.hasOwnProperty("Abi"))
                    object.Abi = message.Abi;
                if (message.Method != null && message.hasOwnProperty("Method"))
                    object.Method = message.Method;
                if (message.Args && message.Args.length) {
                    object.Args = [];
                    for (var j = 0; j < message.Args.length; ++j)
                        object.Args[j] = message.Args[j];
                }
                return object;
            };
    
            /**
             * Converts this TransactionRequest to JSON.
             * @function toJSON
             * @memberof stainless.TransactionRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TransactionRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return TransactionRequest;
        })();
    
        stainless.TransactionHashResponse = (function() {
    
            /**
             * Properties of a TransactionHashResponse.
             * @memberof stainless
             * @interface ITransactionHashResponse
             * @property {Uint8Array|null} [Transaction] TransactionHashResponse Transaction
             * @property {Uint8Array|null} [TransactionHash] TransactionHashResponse TransactionHash
             */
    
            /**
             * Constructs a new TransactionHashResponse.
             * @memberof stainless
             * @classdesc Represents a TransactionHashResponse.
             * @implements ITransactionHashResponse
             * @constructor
             * @param {stainless.ITransactionHashResponse=} [properties] Properties to set
             */
            function TransactionHashResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * TransactionHashResponse Transaction.
             * @member {Uint8Array} Transaction
             * @memberof stainless.TransactionHashResponse
             * @instance
             */
            TransactionHashResponse.prototype.Transaction = $util.newBuffer([]);
    
            /**
             * TransactionHashResponse TransactionHash.
             * @member {Uint8Array} TransactionHash
             * @memberof stainless.TransactionHashResponse
             * @instance
             */
            TransactionHashResponse.prototype.TransactionHash = $util.newBuffer([]);
    
            /**
             * Creates a new TransactionHashResponse instance using the specified properties.
             * @function create
             * @memberof stainless.TransactionHashResponse
             * @static
             * @param {stainless.ITransactionHashResponse=} [properties] Properties to set
             * @returns {stainless.TransactionHashResponse} TransactionHashResponse instance
             */
            TransactionHashResponse.create = function create(properties) {
                return new TransactionHashResponse(properties);
            };
    
            /**
             * Encodes the specified TransactionHashResponse message. Does not implicitly {@link stainless.TransactionHashResponse.verify|verify} messages.
             * @function encode
             * @memberof stainless.TransactionHashResponse
             * @static
             * @param {stainless.ITransactionHashResponse} message TransactionHashResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TransactionHashResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.Transaction != null && message.hasOwnProperty("Transaction"))
                    writer.uint32(/* id 101, wireType 2 =*/810).bytes(message.Transaction);
                if (message.TransactionHash != null && message.hasOwnProperty("TransactionHash"))
                    writer.uint32(/* id 102, wireType 2 =*/818).bytes(message.TransactionHash);
                return writer;
            };
    
            /**
             * Encodes the specified TransactionHashResponse message, length delimited. Does not implicitly {@link stainless.TransactionHashResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof stainless.TransactionHashResponse
             * @static
             * @param {stainless.ITransactionHashResponse} message TransactionHashResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TransactionHashResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a TransactionHashResponse message from the specified reader or buffer.
             * @function decode
             * @memberof stainless.TransactionHashResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {stainless.TransactionHashResponse} TransactionHashResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TransactionHashResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.stainless.TransactionHashResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 101:
                        message.Transaction = reader.bytes();
                        break;
                    case 102:
                        message.TransactionHash = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a TransactionHashResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof stainless.TransactionHashResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {stainless.TransactionHashResponse} TransactionHashResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TransactionHashResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a TransactionHashResponse message.
             * @function verify
             * @memberof stainless.TransactionHashResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TransactionHashResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.Transaction != null && message.hasOwnProperty("Transaction"))
                    if (!(message.Transaction && typeof message.Transaction.length === "number" || $util.isString(message.Transaction)))
                        return "Transaction: buffer expected";
                if (message.TransactionHash != null && message.hasOwnProperty("TransactionHash"))
                    if (!(message.TransactionHash && typeof message.TransactionHash.length === "number" || $util.isString(message.TransactionHash)))
                        return "TransactionHash: buffer expected";
                return null;
            };
    
            /**
             * Creates a TransactionHashResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof stainless.TransactionHashResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {stainless.TransactionHashResponse} TransactionHashResponse
             */
            TransactionHashResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.stainless.TransactionHashResponse)
                    return object;
                var message = new $root.stainless.TransactionHashResponse();
                if (object.Transaction != null)
                    if (typeof object.Transaction === "string")
                        $util.base64.decode(object.Transaction, message.Transaction = $util.newBuffer($util.base64.length(object.Transaction)), 0);
                    else if (object.Transaction.length)
                        message.Transaction = object.Transaction;
                if (object.TransactionHash != null)
                    if (typeof object.TransactionHash === "string")
                        $util.base64.decode(object.TransactionHash, message.TransactionHash = $util.newBuffer($util.base64.length(object.TransactionHash)), 0);
                    else if (object.TransactionHash.length)
                        message.TransactionHash = object.TransactionHash;
                return message;
            };
    
            /**
             * Creates a plain object from a TransactionHashResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof stainless.TransactionHashResponse
             * @static
             * @param {stainless.TransactionHashResponse} message TransactionHashResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TransactionHashResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.Transaction = "";
                    else {
                        object.Transaction = [];
                        if (options.bytes !== Array)
                            object.Transaction = $util.newBuffer(object.Transaction);
                    }
                    if (options.bytes === String)
                        object.TransactionHash = "";
                    else {
                        object.TransactionHash = [];
                        if (options.bytes !== Array)
                            object.TransactionHash = $util.newBuffer(object.TransactionHash);
                    }
                }
                if (message.Transaction != null && message.hasOwnProperty("Transaction"))
                    object.Transaction = options.bytes === String ? $util.base64.encode(message.Transaction, 0, message.Transaction.length) : options.bytes === Array ? Array.prototype.slice.call(message.Transaction) : message.Transaction;
                if (message.TransactionHash != null && message.hasOwnProperty("TransactionHash"))
                    object.TransactionHash = options.bytes === String ? $util.base64.encode(message.TransactionHash, 0, message.TransactionHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.TransactionHash) : message.TransactionHash;
                return object;
            };
    
            /**
             * Converts this TransactionHashResponse to JSON.
             * @function toJSON
             * @memberof stainless.TransactionHashResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TransactionHashResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return TransactionHashResponse;
        })();
    
        stainless.TransactionFinalizationRequest = (function() {
    
            /**
             * Properties of a TransactionFinalizationRequest.
             * @memberof stainless
             * @interface ITransactionFinalizationRequest
             * @property {Uint8Array|null} [Transaction] TransactionFinalizationRequest Transaction
             * @property {Uint8Array|null} [Signature] TransactionFinalizationRequest Signature
             */
    
            /**
             * Constructs a new TransactionFinalizationRequest.
             * @memberof stainless
             * @classdesc Represents a TransactionFinalizationRequest.
             * @implements ITransactionFinalizationRequest
             * @constructor
             * @param {stainless.ITransactionFinalizationRequest=} [properties] Properties to set
             */
            function TransactionFinalizationRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * TransactionFinalizationRequest Transaction.
             * @member {Uint8Array} Transaction
             * @memberof stainless.TransactionFinalizationRequest
             * @instance
             */
            TransactionFinalizationRequest.prototype.Transaction = $util.newBuffer([]);
    
            /**
             * TransactionFinalizationRequest Signature.
             * @member {Uint8Array} Signature
             * @memberof stainless.TransactionFinalizationRequest
             * @instance
             */
            TransactionFinalizationRequest.prototype.Signature = $util.newBuffer([]);
    
            /**
             * Creates a new TransactionFinalizationRequest instance using the specified properties.
             * @function create
             * @memberof stainless.TransactionFinalizationRequest
             * @static
             * @param {stainless.ITransactionFinalizationRequest=} [properties] Properties to set
             * @returns {stainless.TransactionFinalizationRequest} TransactionFinalizationRequest instance
             */
            TransactionFinalizationRequest.create = function create(properties) {
                return new TransactionFinalizationRequest(properties);
            };
    
            /**
             * Encodes the specified TransactionFinalizationRequest message. Does not implicitly {@link stainless.TransactionFinalizationRequest.verify|verify} messages.
             * @function encode
             * @memberof stainless.TransactionFinalizationRequest
             * @static
             * @param {stainless.ITransactionFinalizationRequest} message TransactionFinalizationRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TransactionFinalizationRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.Transaction != null && message.hasOwnProperty("Transaction"))
                    writer.uint32(/* id 101, wireType 2 =*/810).bytes(message.Transaction);
                if (message.Signature != null && message.hasOwnProperty("Signature"))
                    writer.uint32(/* id 102, wireType 2 =*/818).bytes(message.Signature);
                return writer;
            };
    
            /**
             * Encodes the specified TransactionFinalizationRequest message, length delimited. Does not implicitly {@link stainless.TransactionFinalizationRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof stainless.TransactionFinalizationRequest
             * @static
             * @param {stainless.ITransactionFinalizationRequest} message TransactionFinalizationRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TransactionFinalizationRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a TransactionFinalizationRequest message from the specified reader or buffer.
             * @function decode
             * @memberof stainless.TransactionFinalizationRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {stainless.TransactionFinalizationRequest} TransactionFinalizationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TransactionFinalizationRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.stainless.TransactionFinalizationRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 101:
                        message.Transaction = reader.bytes();
                        break;
                    case 102:
                        message.Signature = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a TransactionFinalizationRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof stainless.TransactionFinalizationRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {stainless.TransactionFinalizationRequest} TransactionFinalizationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TransactionFinalizationRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a TransactionFinalizationRequest message.
             * @function verify
             * @memberof stainless.TransactionFinalizationRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TransactionFinalizationRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.Transaction != null && message.hasOwnProperty("Transaction"))
                    if (!(message.Transaction && typeof message.Transaction.length === "number" || $util.isString(message.Transaction)))
                        return "Transaction: buffer expected";
                if (message.Signature != null && message.hasOwnProperty("Signature"))
                    if (!(message.Signature && typeof message.Signature.length === "number" || $util.isString(message.Signature)))
                        return "Signature: buffer expected";
                return null;
            };
    
            /**
             * Creates a TransactionFinalizationRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof stainless.TransactionFinalizationRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {stainless.TransactionFinalizationRequest} TransactionFinalizationRequest
             */
            TransactionFinalizationRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.stainless.TransactionFinalizationRequest)
                    return object;
                var message = new $root.stainless.TransactionFinalizationRequest();
                if (object.Transaction != null)
                    if (typeof object.Transaction === "string")
                        $util.base64.decode(object.Transaction, message.Transaction = $util.newBuffer($util.base64.length(object.Transaction)), 0);
                    else if (object.Transaction.length)
                        message.Transaction = object.Transaction;
                if (object.Signature != null)
                    if (typeof object.Signature === "string")
                        $util.base64.decode(object.Signature, message.Signature = $util.newBuffer($util.base64.length(object.Signature)), 0);
                    else if (object.Signature.length)
                        message.Signature = object.Signature;
                return message;
            };
    
            /**
             * Creates a plain object from a TransactionFinalizationRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof stainless.TransactionFinalizationRequest
             * @static
             * @param {stainless.TransactionFinalizationRequest} message TransactionFinalizationRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TransactionFinalizationRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.Transaction = "";
                    else {
                        object.Transaction = [];
                        if (options.bytes !== Array)
                            object.Transaction = $util.newBuffer(object.Transaction);
                    }
                    if (options.bytes === String)
                        object.Signature = "";
                    else {
                        object.Signature = [];
                        if (options.bytes !== Array)
                            object.Signature = $util.newBuffer(object.Signature);
                    }
                }
                if (message.Transaction != null && message.hasOwnProperty("Transaction"))
                    object.Transaction = options.bytes === String ? $util.base64.encode(message.Transaction, 0, message.Transaction.length) : options.bytes === Array ? Array.prototype.slice.call(message.Transaction) : message.Transaction;
                if (message.Signature != null && message.hasOwnProperty("Signature"))
                    object.Signature = options.bytes === String ? $util.base64.encode(message.Signature, 0, message.Signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.Signature) : message.Signature;
                return object;
            };
    
            /**
             * Converts this TransactionFinalizationRequest to JSON.
             * @function toJSON
             * @memberof stainless.TransactionFinalizationRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TransactionFinalizationRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return TransactionFinalizationRequest;
        })();
    
        stainless.TransactionResponse = (function() {
    
            /**
             * Properties of a TransactionResponse.
             * @memberof stainless
             * @interface ITransactionResponse
             * @property {Uint8Array|null} [Transaction] TransactionResponse Transaction
             */
    
            /**
             * Constructs a new TransactionResponse.
             * @memberof stainless
             * @classdesc Represents a TransactionResponse.
             * @implements ITransactionResponse
             * @constructor
             * @param {stainless.ITransactionResponse=} [properties] Properties to set
             */
            function TransactionResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * TransactionResponse Transaction.
             * @member {Uint8Array} Transaction
             * @memberof stainless.TransactionResponse
             * @instance
             */
            TransactionResponse.prototype.Transaction = $util.newBuffer([]);
    
            /**
             * Creates a new TransactionResponse instance using the specified properties.
             * @function create
             * @memberof stainless.TransactionResponse
             * @static
             * @param {stainless.ITransactionResponse=} [properties] Properties to set
             * @returns {stainless.TransactionResponse} TransactionResponse instance
             */
            TransactionResponse.create = function create(properties) {
                return new TransactionResponse(properties);
            };
    
            /**
             * Encodes the specified TransactionResponse message. Does not implicitly {@link stainless.TransactionResponse.verify|verify} messages.
             * @function encode
             * @memberof stainless.TransactionResponse
             * @static
             * @param {stainless.ITransactionResponse} message TransactionResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TransactionResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.Transaction != null && message.hasOwnProperty("Transaction"))
                    writer.uint32(/* id 101, wireType 2 =*/810).bytes(message.Transaction);
                return writer;
            };
    
            /**
             * Encodes the specified TransactionResponse message, length delimited. Does not implicitly {@link stainless.TransactionResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof stainless.TransactionResponse
             * @static
             * @param {stainless.ITransactionResponse} message TransactionResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TransactionResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a TransactionResponse message from the specified reader or buffer.
             * @function decode
             * @memberof stainless.TransactionResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {stainless.TransactionResponse} TransactionResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TransactionResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.stainless.TransactionResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 101:
                        message.Transaction = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a TransactionResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof stainless.TransactionResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {stainless.TransactionResponse} TransactionResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TransactionResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a TransactionResponse message.
             * @function verify
             * @memberof stainless.TransactionResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TransactionResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.Transaction != null && message.hasOwnProperty("Transaction"))
                    if (!(message.Transaction && typeof message.Transaction.length === "number" || $util.isString(message.Transaction)))
                        return "Transaction: buffer expected";
                return null;
            };
    
            /**
             * Creates a TransactionResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof stainless.TransactionResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {stainless.TransactionResponse} TransactionResponse
             */
            TransactionResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.stainless.TransactionResponse)
                    return object;
                var message = new $root.stainless.TransactionResponse();
                if (object.Transaction != null)
                    if (typeof object.Transaction === "string")
                        $util.base64.decode(object.Transaction, message.Transaction = $util.newBuffer($util.base64.length(object.Transaction)), 0);
                    else if (object.Transaction.length)
                        message.Transaction = object.Transaction;
                return message;
            };
    
            /**
             * Creates a plain object from a TransactionResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof stainless.TransactionResponse
             * @static
             * @param {stainless.TransactionResponse} message TransactionResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TransactionResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.Transaction = "";
                    else {
                        object.Transaction = [];
                        if (options.bytes !== Array)
                            object.Transaction = $util.newBuffer(object.Transaction);
                    }
                if (message.Transaction != null && message.hasOwnProperty("Transaction"))
                    object.Transaction = options.bytes === String ? $util.base64.encode(message.Transaction, 0, message.Transaction.length) : options.bytes === Array ? Array.prototype.slice.call(message.Transaction) : message.Transaction;
                return object;
            };
    
            /**
             * Converts this TransactionResponse to JSON.
             * @function toJSON
             * @memberof stainless.TransactionResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TransactionResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return TransactionResponse;
        })();
    
        stainless.CallRequest = (function() {
    
            /**
             * Properties of a CallRequest.
             * @memberof stainless
             * @interface ICallRequest
             * @property {Uint8Array|null} [BlockID] CallRequest BlockID
             * @property {string|null} [ServerConfig] CallRequest ServerConfig
             * @property {Uint8Array|null} [BEvmInstanceID] CallRequest BEvmInstanceID
             * @property {Uint8Array|null} [AccountAddress] CallRequest AccountAddress
             * @property {Uint8Array|null} [ContractAddress] CallRequest ContractAddress
             * @property {string|null} [Abi] CallRequest Abi
             * @property {string|null} [Method] CallRequest Method
             * @property {Array.<string>|null} [Args] CallRequest Args
             */
    
            /**
             * Constructs a new CallRequest.
             * @memberof stainless
             * @classdesc Represents a CallRequest.
             * @implements ICallRequest
             * @constructor
             * @param {stainless.ICallRequest=} [properties] Properties to set
             */
            function CallRequest(properties) {
                this.Args = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * CallRequest BlockID.
             * @member {Uint8Array} BlockID
             * @memberof stainless.CallRequest
             * @instance
             */
            CallRequest.prototype.BlockID = $util.newBuffer([]);
    
            /**
             * CallRequest ServerConfig.
             * @member {string} ServerConfig
             * @memberof stainless.CallRequest
             * @instance
             */
            CallRequest.prototype.ServerConfig = "";
    
            /**
             * CallRequest BEvmInstanceID.
             * @member {Uint8Array} BEvmInstanceID
             * @memberof stainless.CallRequest
             * @instance
             */
            CallRequest.prototype.BEvmInstanceID = $util.newBuffer([]);
    
            /**
             * CallRequest AccountAddress.
             * @member {Uint8Array} AccountAddress
             * @memberof stainless.CallRequest
             * @instance
             */
            CallRequest.prototype.AccountAddress = $util.newBuffer([]);
    
            /**
             * CallRequest ContractAddress.
             * @member {Uint8Array} ContractAddress
             * @memberof stainless.CallRequest
             * @instance
             */
            CallRequest.prototype.ContractAddress = $util.newBuffer([]);
    
            /**
             * CallRequest Abi.
             * @member {string} Abi
             * @memberof stainless.CallRequest
             * @instance
             */
            CallRequest.prototype.Abi = "";
    
            /**
             * CallRequest Method.
             * @member {string} Method
             * @memberof stainless.CallRequest
             * @instance
             */
            CallRequest.prototype.Method = "";
    
            /**
             * CallRequest Args.
             * @member {Array.<string>} Args
             * @memberof stainless.CallRequest
             * @instance
             */
            CallRequest.prototype.Args = $util.emptyArray;
    
            /**
             * Creates a new CallRequest instance using the specified properties.
             * @function create
             * @memberof stainless.CallRequest
             * @static
             * @param {stainless.ICallRequest=} [properties] Properties to set
             * @returns {stainless.CallRequest} CallRequest instance
             */
            CallRequest.create = function create(properties) {
                return new CallRequest(properties);
            };
    
            /**
             * Encodes the specified CallRequest message. Does not implicitly {@link stainless.CallRequest.verify|verify} messages.
             * @function encode
             * @memberof stainless.CallRequest
             * @static
             * @param {stainless.ICallRequest} message CallRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.BlockID != null && message.hasOwnProperty("BlockID"))
                    writer.uint32(/* id 101, wireType 2 =*/810).bytes(message.BlockID);
                if (message.ServerConfig != null && message.hasOwnProperty("ServerConfig"))
                    writer.uint32(/* id 102, wireType 2 =*/818).string(message.ServerConfig);
                if (message.BEvmInstanceID != null && message.hasOwnProperty("BEvmInstanceID"))
                    writer.uint32(/* id 103, wireType 2 =*/826).bytes(message.BEvmInstanceID);
                if (message.AccountAddress != null && message.hasOwnProperty("AccountAddress"))
                    writer.uint32(/* id 104, wireType 2 =*/834).bytes(message.AccountAddress);
                if (message.ContractAddress != null && message.hasOwnProperty("ContractAddress"))
                    writer.uint32(/* id 105, wireType 2 =*/842).bytes(message.ContractAddress);
                if (message.Abi != null && message.hasOwnProperty("Abi"))
                    writer.uint32(/* id 106, wireType 2 =*/850).string(message.Abi);
                if (message.Method != null && message.hasOwnProperty("Method"))
                    writer.uint32(/* id 107, wireType 2 =*/858).string(message.Method);
                if (message.Args != null && message.Args.length)
                    for (var i = 0; i < message.Args.length; ++i)
                        writer.uint32(/* id 108, wireType 2 =*/866).string(message.Args[i]);
                return writer;
            };
    
            /**
             * Encodes the specified CallRequest message, length delimited. Does not implicitly {@link stainless.CallRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof stainless.CallRequest
             * @static
             * @param {stainless.ICallRequest} message CallRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a CallRequest message from the specified reader or buffer.
             * @function decode
             * @memberof stainless.CallRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {stainless.CallRequest} CallRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.stainless.CallRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 101:
                        message.BlockID = reader.bytes();
                        break;
                    case 102:
                        message.ServerConfig = reader.string();
                        break;
                    case 103:
                        message.BEvmInstanceID = reader.bytes();
                        break;
                    case 104:
                        message.AccountAddress = reader.bytes();
                        break;
                    case 105:
                        message.ContractAddress = reader.bytes();
                        break;
                    case 106:
                        message.Abi = reader.string();
                        break;
                    case 107:
                        message.Method = reader.string();
                        break;
                    case 108:
                        if (!(message.Args && message.Args.length))
                            message.Args = [];
                        message.Args.push(reader.string());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a CallRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof stainless.CallRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {stainless.CallRequest} CallRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a CallRequest message.
             * @function verify
             * @memberof stainless.CallRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CallRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.BlockID != null && message.hasOwnProperty("BlockID"))
                    if (!(message.BlockID && typeof message.BlockID.length === "number" || $util.isString(message.BlockID)))
                        return "BlockID: buffer expected";
                if (message.ServerConfig != null && message.hasOwnProperty("ServerConfig"))
                    if (!$util.isString(message.ServerConfig))
                        return "ServerConfig: string expected";
                if (message.BEvmInstanceID != null && message.hasOwnProperty("BEvmInstanceID"))
                    if (!(message.BEvmInstanceID && typeof message.BEvmInstanceID.length === "number" || $util.isString(message.BEvmInstanceID)))
                        return "BEvmInstanceID: buffer expected";
                if (message.AccountAddress != null && message.hasOwnProperty("AccountAddress"))
                    if (!(message.AccountAddress && typeof message.AccountAddress.length === "number" || $util.isString(message.AccountAddress)))
                        return "AccountAddress: buffer expected";
                if (message.ContractAddress != null && message.hasOwnProperty("ContractAddress"))
                    if (!(message.ContractAddress && typeof message.ContractAddress.length === "number" || $util.isString(message.ContractAddress)))
                        return "ContractAddress: buffer expected";
                if (message.Abi != null && message.hasOwnProperty("Abi"))
                    if (!$util.isString(message.Abi))
                        return "Abi: string expected";
                if (message.Method != null && message.hasOwnProperty("Method"))
                    if (!$util.isString(message.Method))
                        return "Method: string expected";
                if (message.Args != null && message.hasOwnProperty("Args")) {
                    if (!Array.isArray(message.Args))
                        return "Args: array expected";
                    for (var i = 0; i < message.Args.length; ++i)
                        if (!$util.isString(message.Args[i]))
                            return "Args: string[] expected";
                }
                return null;
            };
    
            /**
             * Creates a CallRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof stainless.CallRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {stainless.CallRequest} CallRequest
             */
            CallRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.stainless.CallRequest)
                    return object;
                var message = new $root.stainless.CallRequest();
                if (object.BlockID != null)
                    if (typeof object.BlockID === "string")
                        $util.base64.decode(object.BlockID, message.BlockID = $util.newBuffer($util.base64.length(object.BlockID)), 0);
                    else if (object.BlockID.length)
                        message.BlockID = object.BlockID;
                if (object.ServerConfig != null)
                    message.ServerConfig = String(object.ServerConfig);
                if (object.BEvmInstanceID != null)
                    if (typeof object.BEvmInstanceID === "string")
                        $util.base64.decode(object.BEvmInstanceID, message.BEvmInstanceID = $util.newBuffer($util.base64.length(object.BEvmInstanceID)), 0);
                    else if (object.BEvmInstanceID.length)
                        message.BEvmInstanceID = object.BEvmInstanceID;
                if (object.AccountAddress != null)
                    if (typeof object.AccountAddress === "string")
                        $util.base64.decode(object.AccountAddress, message.AccountAddress = $util.newBuffer($util.base64.length(object.AccountAddress)), 0);
                    else if (object.AccountAddress.length)
                        message.AccountAddress = object.AccountAddress;
                if (object.ContractAddress != null)
                    if (typeof object.ContractAddress === "string")
                        $util.base64.decode(object.ContractAddress, message.ContractAddress = $util.newBuffer($util.base64.length(object.ContractAddress)), 0);
                    else if (object.ContractAddress.length)
                        message.ContractAddress = object.ContractAddress;
                if (object.Abi != null)
                    message.Abi = String(object.Abi);
                if (object.Method != null)
                    message.Method = String(object.Method);
                if (object.Args) {
                    if (!Array.isArray(object.Args))
                        throw TypeError(".stainless.CallRequest.Args: array expected");
                    message.Args = [];
                    for (var i = 0; i < object.Args.length; ++i)
                        message.Args[i] = String(object.Args[i]);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a CallRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof stainless.CallRequest
             * @static
             * @param {stainless.CallRequest} message CallRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CallRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.Args = [];
                if (options.defaults) {
                    if (options.bytes === String)
                        object.BlockID = "";
                    else {
                        object.BlockID = [];
                        if (options.bytes !== Array)
                            object.BlockID = $util.newBuffer(object.BlockID);
                    }
                    object.ServerConfig = "";
                    if (options.bytes === String)
                        object.BEvmInstanceID = "";
                    else {
                        object.BEvmInstanceID = [];
                        if (options.bytes !== Array)
                            object.BEvmInstanceID = $util.newBuffer(object.BEvmInstanceID);
                    }
                    if (options.bytes === String)
                        object.AccountAddress = "";
                    else {
                        object.AccountAddress = [];
                        if (options.bytes !== Array)
                            object.AccountAddress = $util.newBuffer(object.AccountAddress);
                    }
                    if (options.bytes === String)
                        object.ContractAddress = "";
                    else {
                        object.ContractAddress = [];
                        if (options.bytes !== Array)
                            object.ContractAddress = $util.newBuffer(object.ContractAddress);
                    }
                    object.Abi = "";
                    object.Method = "";
                }
                if (message.BlockID != null && message.hasOwnProperty("BlockID"))
                    object.BlockID = options.bytes === String ? $util.base64.encode(message.BlockID, 0, message.BlockID.length) : options.bytes === Array ? Array.prototype.slice.call(message.BlockID) : message.BlockID;
                if (message.ServerConfig != null && message.hasOwnProperty("ServerConfig"))
                    object.ServerConfig = message.ServerConfig;
                if (message.BEvmInstanceID != null && message.hasOwnProperty("BEvmInstanceID"))
                    object.BEvmInstanceID = options.bytes === String ? $util.base64.encode(message.BEvmInstanceID, 0, message.BEvmInstanceID.length) : options.bytes === Array ? Array.prototype.slice.call(message.BEvmInstanceID) : message.BEvmInstanceID;
                if (message.AccountAddress != null && message.hasOwnProperty("AccountAddress"))
                    object.AccountAddress = options.bytes === String ? $util.base64.encode(message.AccountAddress, 0, message.AccountAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.AccountAddress) : message.AccountAddress;
                if (message.ContractAddress != null && message.hasOwnProperty("ContractAddress"))
                    object.ContractAddress = options.bytes === String ? $util.base64.encode(message.ContractAddress, 0, message.ContractAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.ContractAddress) : message.ContractAddress;
                if (message.Abi != null && message.hasOwnProperty("Abi"))
                    object.Abi = message.Abi;
                if (message.Method != null && message.hasOwnProperty("Method"))
                    object.Method = message.Method;
                if (message.Args && message.Args.length) {
                    object.Args = [];
                    for (var j = 0; j < message.Args.length; ++j)
                        object.Args[j] = message.Args[j];
                }
                return object;
            };
    
            /**
             * Converts this CallRequest to JSON.
             * @function toJSON
             * @memberof stainless.CallRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CallRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return CallRequest;
        })();
    
        stainless.CallResponse = (function() {
    
            /**
             * Properties of a CallResponse.
             * @memberof stainless
             * @interface ICallResponse
             * @property {string|null} [Result] CallResponse Result
             */
    
            /**
             * Constructs a new CallResponse.
             * @memberof stainless
             * @classdesc Represents a CallResponse.
             * @implements ICallResponse
             * @constructor
             * @param {stainless.ICallResponse=} [properties] Properties to set
             */
            function CallResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * CallResponse Result.
             * @member {string} Result
             * @memberof stainless.CallResponse
             * @instance
             */
            CallResponse.prototype.Result = "";
    
            /**
             * Creates a new CallResponse instance using the specified properties.
             * @function create
             * @memberof stainless.CallResponse
             * @static
             * @param {stainless.ICallResponse=} [properties] Properties to set
             * @returns {stainless.CallResponse} CallResponse instance
             */
            CallResponse.create = function create(properties) {
                return new CallResponse(properties);
            };
    
            /**
             * Encodes the specified CallResponse message. Does not implicitly {@link stainless.CallResponse.verify|verify} messages.
             * @function encode
             * @memberof stainless.CallResponse
             * @static
             * @param {stainless.ICallResponse} message CallResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.Result != null && message.hasOwnProperty("Result"))
                    writer.uint32(/* id 101, wireType 2 =*/810).string(message.Result);
                return writer;
            };
    
            /**
             * Encodes the specified CallResponse message, length delimited. Does not implicitly {@link stainless.CallResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof stainless.CallResponse
             * @static
             * @param {stainless.ICallResponse} message CallResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CallResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a CallResponse message from the specified reader or buffer.
             * @function decode
             * @memberof stainless.CallResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {stainless.CallResponse} CallResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.stainless.CallResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 101:
                        message.Result = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a CallResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof stainless.CallResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {stainless.CallResponse} CallResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CallResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a CallResponse message.
             * @function verify
             * @memberof stainless.CallResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CallResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.Result != null && message.hasOwnProperty("Result"))
                    if (!$util.isString(message.Result))
                        return "Result: string expected";
                return null;
            };
    
            /**
             * Creates a CallResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof stainless.CallResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {stainless.CallResponse} CallResponse
             */
            CallResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.stainless.CallResponse)
                    return object;
                var message = new $root.stainless.CallResponse();
                if (object.Result != null)
                    message.Result = String(object.Result);
                return message;
            };
    
            /**
             * Creates a plain object from a CallResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof stainless.CallResponse
             * @static
             * @param {stainless.CallResponse} message CallResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CallResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.Result = "";
                if (message.Result != null && message.hasOwnProperty("Result"))
                    object.Result = message.Result;
                return object;
            };
    
            /**
             * Converts this CallResponse to JSON.
             * @function toJSON
             * @memberof stainless.CallResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CallResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return CallResponse;
        })();
    
        return stainless;
    })();

    return $root;
});
