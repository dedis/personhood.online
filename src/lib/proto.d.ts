import * as $protobuf from "protobufjs";
/** Namespace stainless. */
export namespace stainless {

    /** Properties of a VerificationRequest. */
    interface IVerificationRequest {

        /** VerificationRequest SourceFiles */
        SourceFiles?: ({ [k: string]: string }|null);
    }

    /** Represents a VerificationRequest. */
    class VerificationRequest implements IVerificationRequest {

        /**
         * Constructs a new VerificationRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: stainless.IVerificationRequest);

        /** VerificationRequest SourceFiles. */
        public SourceFiles: { [k: string]: string };

        /**
         * Creates a new VerificationRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VerificationRequest instance
         */
        public static create(properties?: stainless.IVerificationRequest): stainless.VerificationRequest;

        /**
         * Encodes the specified VerificationRequest message. Does not implicitly {@link stainless.VerificationRequest.verify|verify} messages.
         * @param message VerificationRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: stainless.IVerificationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified VerificationRequest message, length delimited. Does not implicitly {@link stainless.VerificationRequest.verify|verify} messages.
         * @param message VerificationRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: stainless.IVerificationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a VerificationRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VerificationRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): stainless.VerificationRequest;

        /**
         * Decodes a VerificationRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VerificationRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): stainless.VerificationRequest;

        /**
         * Verifies a VerificationRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a VerificationRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns VerificationRequest
         */
        public static fromObject(object: { [k: string]: any }): stainless.VerificationRequest;

        /**
         * Creates a plain object from a VerificationRequest message. Also converts values to other types if specified.
         * @param message VerificationRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: stainless.VerificationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this VerificationRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a VerificationResponse. */
    interface IVerificationResponse {

        /** VerificationResponse Console */
        Console?: (string|null);

        /** VerificationResponse Report */
        Report?: (string|null);
    }

    /** Represents a VerificationResponse. */
    class VerificationResponse implements IVerificationResponse {

        /**
         * Constructs a new VerificationResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: stainless.IVerificationResponse);

        /** VerificationResponse Console. */
        public Console: string;

        /** VerificationResponse Report. */
        public Report: string;

        /**
         * Creates a new VerificationResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VerificationResponse instance
         */
        public static create(properties?: stainless.IVerificationResponse): stainless.VerificationResponse;

        /**
         * Encodes the specified VerificationResponse message. Does not implicitly {@link stainless.VerificationResponse.verify|verify} messages.
         * @param message VerificationResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: stainless.IVerificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified VerificationResponse message, length delimited. Does not implicitly {@link stainless.VerificationResponse.verify|verify} messages.
         * @param message VerificationResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: stainless.IVerificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a VerificationResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VerificationResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): stainless.VerificationResponse;

        /**
         * Decodes a VerificationResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VerificationResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): stainless.VerificationResponse;

        /**
         * Verifies a VerificationResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a VerificationResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns VerificationResponse
         */
        public static fromObject(object: { [k: string]: any }): stainless.VerificationResponse;

        /**
         * Creates a plain object from a VerificationResponse message. Also converts values to other types if specified.
         * @param message VerificationResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: stainless.VerificationResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this VerificationResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BytecodeGenRequest. */
    interface IBytecodeGenRequest {

        /** BytecodeGenRequest SourceFiles */
        SourceFiles?: ({ [k: string]: string }|null);
    }

    /** Represents a BytecodeGenRequest. */
    class BytecodeGenRequest implements IBytecodeGenRequest {

        /**
         * Constructs a new BytecodeGenRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: stainless.IBytecodeGenRequest);

        /** BytecodeGenRequest SourceFiles. */
        public SourceFiles: { [k: string]: string };

        /**
         * Creates a new BytecodeGenRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BytecodeGenRequest instance
         */
        public static create(properties?: stainless.IBytecodeGenRequest): stainless.BytecodeGenRequest;

        /**
         * Encodes the specified BytecodeGenRequest message. Does not implicitly {@link stainless.BytecodeGenRequest.verify|verify} messages.
         * @param message BytecodeGenRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: stainless.IBytecodeGenRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BytecodeGenRequest message, length delimited. Does not implicitly {@link stainless.BytecodeGenRequest.verify|verify} messages.
         * @param message BytecodeGenRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: stainless.IBytecodeGenRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BytecodeGenRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BytecodeGenRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): stainless.BytecodeGenRequest;

        /**
         * Decodes a BytecodeGenRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BytecodeGenRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): stainless.BytecodeGenRequest;

        /**
         * Verifies a BytecodeGenRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BytecodeGenRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BytecodeGenRequest
         */
        public static fromObject(object: { [k: string]: any }): stainless.BytecodeGenRequest;

        /**
         * Creates a plain object from a BytecodeGenRequest message. Also converts values to other types if specified.
         * @param message BytecodeGenRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: stainless.BytecodeGenRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BytecodeGenRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BytecodeObj. */
    interface IBytecodeObj {

        /** BytecodeObj Abi */
        Abi?: (string|null);

        /** BytecodeObj Bin */
        Bin?: (string|null);
    }

    /** Represents a BytecodeObj. */
    class BytecodeObj implements IBytecodeObj {

        /**
         * Constructs a new BytecodeObj.
         * @param [properties] Properties to set
         */
        constructor(properties?: stainless.IBytecodeObj);

        /** BytecodeObj Abi. */
        public Abi: string;

        /** BytecodeObj Bin. */
        public Bin: string;

        /**
         * Creates a new BytecodeObj instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BytecodeObj instance
         */
        public static create(properties?: stainless.IBytecodeObj): stainless.BytecodeObj;

        /**
         * Encodes the specified BytecodeObj message. Does not implicitly {@link stainless.BytecodeObj.verify|verify} messages.
         * @param message BytecodeObj message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: stainless.IBytecodeObj, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BytecodeObj message, length delimited. Does not implicitly {@link stainless.BytecodeObj.verify|verify} messages.
         * @param message BytecodeObj message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: stainless.IBytecodeObj, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BytecodeObj message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BytecodeObj
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): stainless.BytecodeObj;

        /**
         * Decodes a BytecodeObj message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BytecodeObj
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): stainless.BytecodeObj;

        /**
         * Verifies a BytecodeObj message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BytecodeObj message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BytecodeObj
         */
        public static fromObject(object: { [k: string]: any }): stainless.BytecodeObj;

        /**
         * Creates a plain object from a BytecodeObj message. Also converts values to other types if specified.
         * @param message BytecodeObj
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: stainless.BytecodeObj, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BytecodeObj to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BytecodeGenResponse. */
    interface IBytecodeGenResponse {

        /** BytecodeGenResponse BytecodeObjs */
        BytecodeObjs?: ({ [k: string]: stainless.IBytecodeObj }|null);
    }

    /** Represents a BytecodeGenResponse. */
    class BytecodeGenResponse implements IBytecodeGenResponse {

        /**
         * Constructs a new BytecodeGenResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: stainless.IBytecodeGenResponse);

        /** BytecodeGenResponse BytecodeObjs. */
        public BytecodeObjs: { [k: string]: stainless.IBytecodeObj };

        /**
         * Creates a new BytecodeGenResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BytecodeGenResponse instance
         */
        public static create(properties?: stainless.IBytecodeGenResponse): stainless.BytecodeGenResponse;

        /**
         * Encodes the specified BytecodeGenResponse message. Does not implicitly {@link stainless.BytecodeGenResponse.verify|verify} messages.
         * @param message BytecodeGenResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: stainless.IBytecodeGenResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BytecodeGenResponse message, length delimited. Does not implicitly {@link stainless.BytecodeGenResponse.verify|verify} messages.
         * @param message BytecodeGenResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: stainless.IBytecodeGenResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BytecodeGenResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BytecodeGenResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): stainless.BytecodeGenResponse;

        /**
         * Decodes a BytecodeGenResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BytecodeGenResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): stainless.BytecodeGenResponse;

        /**
         * Verifies a BytecodeGenResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BytecodeGenResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BytecodeGenResponse
         */
        public static fromObject(object: { [k: string]: any }): stainless.BytecodeGenResponse;

        /**
         * Creates a plain object from a BytecodeGenResponse message. Also converts values to other types if specified.
         * @param message BytecodeGenResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: stainless.BytecodeGenResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BytecodeGenResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DeployRequest. */
    interface IDeployRequest {

        /** DeployRequest GasLimit */
        GasLimit?: (number|Long|null);

        /** DeployRequest GasPrice */
        GasPrice?: (number|Long|null);

        /** DeployRequest Amount */
        Amount?: (number|Long|null);

        /** DeployRequest Nonce */
        Nonce?: (number|Long|null);

        /** DeployRequest Bytecode */
        Bytecode?: (Uint8Array|null);

        /** DeployRequest Abi */
        Abi?: (string|null);

        /** DeployRequest Args */
        Args?: (string[]|null);
    }

    /** Represents a DeployRequest. */
    class DeployRequest implements IDeployRequest {

        /**
         * Constructs a new DeployRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: stainless.IDeployRequest);

        /** DeployRequest GasLimit. */
        public GasLimit: (number|Long);

        /** DeployRequest GasPrice. */
        public GasPrice: (number|Long);

        /** DeployRequest Amount. */
        public Amount: (number|Long);

        /** DeployRequest Nonce. */
        public Nonce: (number|Long);

        /** DeployRequest Bytecode. */
        public Bytecode: Uint8Array;

        /** DeployRequest Abi. */
        public Abi: string;

        /** DeployRequest Args. */
        public Args: string[];

        /**
         * Creates a new DeployRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeployRequest instance
         */
        public static create(properties?: stainless.IDeployRequest): stainless.DeployRequest;

        /**
         * Encodes the specified DeployRequest message. Does not implicitly {@link stainless.DeployRequest.verify|verify} messages.
         * @param message DeployRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: stainless.IDeployRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeployRequest message, length delimited. Does not implicitly {@link stainless.DeployRequest.verify|verify} messages.
         * @param message DeployRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: stainless.IDeployRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeployRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeployRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): stainless.DeployRequest;

        /**
         * Decodes a DeployRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeployRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): stainless.DeployRequest;

        /**
         * Verifies a DeployRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeployRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeployRequest
         */
        public static fromObject(object: { [k: string]: any }): stainless.DeployRequest;

        /**
         * Creates a plain object from a DeployRequest message. Also converts values to other types if specified.
         * @param message DeployRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: stainless.DeployRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeployRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TransactionRequest. */
    interface ITransactionRequest {

        /** TransactionRequest GasLimit */
        GasLimit?: (number|Long|null);

        /** TransactionRequest GasPrice */
        GasPrice?: (number|Long|null);

        /** TransactionRequest Amount */
        Amount?: (number|Long|null);

        /** TransactionRequest ContractAddress */
        ContractAddress?: (Uint8Array|null);

        /** TransactionRequest Nonce */
        Nonce?: (number|Long|null);

        /** TransactionRequest Abi */
        Abi?: (string|null);

        /** TransactionRequest Method */
        Method?: (string|null);

        /** TransactionRequest Args */
        Args?: (string[]|null);
    }

    /** Represents a TransactionRequest. */
    class TransactionRequest implements ITransactionRequest {

        /**
         * Constructs a new TransactionRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: stainless.ITransactionRequest);

        /** TransactionRequest GasLimit. */
        public GasLimit: (number|Long);

        /** TransactionRequest GasPrice. */
        public GasPrice: (number|Long);

        /** TransactionRequest Amount. */
        public Amount: (number|Long);

        /** TransactionRequest ContractAddress. */
        public ContractAddress: Uint8Array;

        /** TransactionRequest Nonce. */
        public Nonce: (number|Long);

        /** TransactionRequest Abi. */
        public Abi: string;

        /** TransactionRequest Method. */
        public Method: string;

        /** TransactionRequest Args. */
        public Args: string[];

        /**
         * Creates a new TransactionRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TransactionRequest instance
         */
        public static create(properties?: stainless.ITransactionRequest): stainless.TransactionRequest;

        /**
         * Encodes the specified TransactionRequest message. Does not implicitly {@link stainless.TransactionRequest.verify|verify} messages.
         * @param message TransactionRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: stainless.ITransactionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TransactionRequest message, length delimited. Does not implicitly {@link stainless.TransactionRequest.verify|verify} messages.
         * @param message TransactionRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: stainless.ITransactionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TransactionRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TransactionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): stainless.TransactionRequest;

        /**
         * Decodes a TransactionRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TransactionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): stainless.TransactionRequest;

        /**
         * Verifies a TransactionRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TransactionRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TransactionRequest
         */
        public static fromObject(object: { [k: string]: any }): stainless.TransactionRequest;

        /**
         * Creates a plain object from a TransactionRequest message. Also converts values to other types if specified.
         * @param message TransactionRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: stainless.TransactionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TransactionRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TransactionHashResponse. */
    interface ITransactionHashResponse {

        /** TransactionHashResponse Transaction */
        Transaction?: (Uint8Array|null);

        /** TransactionHashResponse TransactionHash */
        TransactionHash?: (Uint8Array|null);
    }

    /** Represents a TransactionHashResponse. */
    class TransactionHashResponse implements ITransactionHashResponse {

        /**
         * Constructs a new TransactionHashResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: stainless.ITransactionHashResponse);

        /** TransactionHashResponse Transaction. */
        public Transaction: Uint8Array;

        /** TransactionHashResponse TransactionHash. */
        public TransactionHash: Uint8Array;

        /**
         * Creates a new TransactionHashResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TransactionHashResponse instance
         */
        public static create(properties?: stainless.ITransactionHashResponse): stainless.TransactionHashResponse;

        /**
         * Encodes the specified TransactionHashResponse message. Does not implicitly {@link stainless.TransactionHashResponse.verify|verify} messages.
         * @param message TransactionHashResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: stainless.ITransactionHashResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TransactionHashResponse message, length delimited. Does not implicitly {@link stainless.TransactionHashResponse.verify|verify} messages.
         * @param message TransactionHashResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: stainless.ITransactionHashResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TransactionHashResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TransactionHashResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): stainless.TransactionHashResponse;

        /**
         * Decodes a TransactionHashResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TransactionHashResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): stainless.TransactionHashResponse;

        /**
         * Verifies a TransactionHashResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TransactionHashResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TransactionHashResponse
         */
        public static fromObject(object: { [k: string]: any }): stainless.TransactionHashResponse;

        /**
         * Creates a plain object from a TransactionHashResponse message. Also converts values to other types if specified.
         * @param message TransactionHashResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: stainless.TransactionHashResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TransactionHashResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TransactionFinalizationRequest. */
    interface ITransactionFinalizationRequest {

        /** TransactionFinalizationRequest Transaction */
        Transaction?: (Uint8Array|null);

        /** TransactionFinalizationRequest Signature */
        Signature?: (Uint8Array|null);
    }

    /** Represents a TransactionFinalizationRequest. */
    class TransactionFinalizationRequest implements ITransactionFinalizationRequest {

        /**
         * Constructs a new TransactionFinalizationRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: stainless.ITransactionFinalizationRequest);

        /** TransactionFinalizationRequest Transaction. */
        public Transaction: Uint8Array;

        /** TransactionFinalizationRequest Signature. */
        public Signature: Uint8Array;

        /**
         * Creates a new TransactionFinalizationRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TransactionFinalizationRequest instance
         */
        public static create(properties?: stainless.ITransactionFinalizationRequest): stainless.TransactionFinalizationRequest;

        /**
         * Encodes the specified TransactionFinalizationRequest message. Does not implicitly {@link stainless.TransactionFinalizationRequest.verify|verify} messages.
         * @param message TransactionFinalizationRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: stainless.ITransactionFinalizationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TransactionFinalizationRequest message, length delimited. Does not implicitly {@link stainless.TransactionFinalizationRequest.verify|verify} messages.
         * @param message TransactionFinalizationRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: stainless.ITransactionFinalizationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TransactionFinalizationRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TransactionFinalizationRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): stainless.TransactionFinalizationRequest;

        /**
         * Decodes a TransactionFinalizationRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TransactionFinalizationRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): stainless.TransactionFinalizationRequest;

        /**
         * Verifies a TransactionFinalizationRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TransactionFinalizationRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TransactionFinalizationRequest
         */
        public static fromObject(object: { [k: string]: any }): stainless.TransactionFinalizationRequest;

        /**
         * Creates a plain object from a TransactionFinalizationRequest message. Also converts values to other types if specified.
         * @param message TransactionFinalizationRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: stainless.TransactionFinalizationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TransactionFinalizationRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TransactionResponse. */
    interface ITransactionResponse {

        /** TransactionResponse Transaction */
        Transaction?: (Uint8Array|null);
    }

    /** Represents a TransactionResponse. */
    class TransactionResponse implements ITransactionResponse {

        /**
         * Constructs a new TransactionResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: stainless.ITransactionResponse);

        /** TransactionResponse Transaction. */
        public Transaction: Uint8Array;

        /**
         * Creates a new TransactionResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TransactionResponse instance
         */
        public static create(properties?: stainless.ITransactionResponse): stainless.TransactionResponse;

        /**
         * Encodes the specified TransactionResponse message. Does not implicitly {@link stainless.TransactionResponse.verify|verify} messages.
         * @param message TransactionResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: stainless.ITransactionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TransactionResponse message, length delimited. Does not implicitly {@link stainless.TransactionResponse.verify|verify} messages.
         * @param message TransactionResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: stainless.ITransactionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TransactionResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TransactionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): stainless.TransactionResponse;

        /**
         * Decodes a TransactionResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TransactionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): stainless.TransactionResponse;

        /**
         * Verifies a TransactionResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TransactionResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TransactionResponse
         */
        public static fromObject(object: { [k: string]: any }): stainless.TransactionResponse;

        /**
         * Creates a plain object from a TransactionResponse message. Also converts values to other types if specified.
         * @param message TransactionResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: stainless.TransactionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TransactionResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CallRequest. */
    interface ICallRequest {

        /** CallRequest BlockID */
        BlockID?: (Uint8Array|null);

        /** CallRequest ServerConfig */
        ServerConfig?: (string|null);

        /** CallRequest BEvmInstanceID */
        BEvmInstanceID?: (Uint8Array|null);

        /** CallRequest AccountAddress */
        AccountAddress?: (Uint8Array|null);

        /** CallRequest ContractAddress */
        ContractAddress?: (Uint8Array|null);

        /** CallRequest Abi */
        Abi?: (string|null);

        /** CallRequest Method */
        Method?: (string|null);

        /** CallRequest Args */
        Args?: (string[]|null);
    }

    /** Represents a CallRequest. */
    class CallRequest implements ICallRequest {

        /**
         * Constructs a new CallRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: stainless.ICallRequest);

        /** CallRequest BlockID. */
        public BlockID: Uint8Array;

        /** CallRequest ServerConfig. */
        public ServerConfig: string;

        /** CallRequest BEvmInstanceID. */
        public BEvmInstanceID: Uint8Array;

        /** CallRequest AccountAddress. */
        public AccountAddress: Uint8Array;

        /** CallRequest ContractAddress. */
        public ContractAddress: Uint8Array;

        /** CallRequest Abi. */
        public Abi: string;

        /** CallRequest Method. */
        public Method: string;

        /** CallRequest Args. */
        public Args: string[];

        /**
         * Creates a new CallRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CallRequest instance
         */
        public static create(properties?: stainless.ICallRequest): stainless.CallRequest;

        /**
         * Encodes the specified CallRequest message. Does not implicitly {@link stainless.CallRequest.verify|verify} messages.
         * @param message CallRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: stainless.ICallRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CallRequest message, length delimited. Does not implicitly {@link stainless.CallRequest.verify|verify} messages.
         * @param message CallRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: stainless.ICallRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CallRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CallRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): stainless.CallRequest;

        /**
         * Decodes a CallRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CallRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): stainless.CallRequest;

        /**
         * Verifies a CallRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CallRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CallRequest
         */
        public static fromObject(object: { [k: string]: any }): stainless.CallRequest;

        /**
         * Creates a plain object from a CallRequest message. Also converts values to other types if specified.
         * @param message CallRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: stainless.CallRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CallRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CallResponse. */
    interface ICallResponse {

        /** CallResponse Result */
        Result?: (string|null);
    }

    /** Represents a CallResponse. */
    class CallResponse implements ICallResponse {

        /**
         * Constructs a new CallResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: stainless.ICallResponse);

        /** CallResponse Result. */
        public Result: string;

        /**
         * Creates a new CallResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CallResponse instance
         */
        public static create(properties?: stainless.ICallResponse): stainless.CallResponse;

        /**
         * Encodes the specified CallResponse message. Does not implicitly {@link stainless.CallResponse.verify|verify} messages.
         * @param message CallResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: stainless.ICallResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CallResponse message, length delimited. Does not implicitly {@link stainless.CallResponse.verify|verify} messages.
         * @param message CallResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: stainless.ICallResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CallResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CallResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): stainless.CallResponse;

        /**
         * Decodes a CallResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CallResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): stainless.CallResponse;

        /**
         * Verifies a CallResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CallResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CallResponse
         */
        public static fromObject(object: { [k: string]: any }): stainless.CallResponse;

        /**
         * Creates a plain object from a CallResponse message. Also converts values to other types if specified.
         * @param message CallResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: stainless.CallResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CallResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
