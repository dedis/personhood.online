import { Buffer } from 'buffer'

export const CONTRACT_BYTECODE = Buffer.from(
    '6080604052348015620000125760006000fd5b505b6040518060400160405280600781526020017f506f70636f696e00000000000000000000000000000000000000000000000000815260200150600060005090805190602001906200006792919062000181565b506040518060400160405280600381526020017f504f50000000000000000000000000000000000000000000000000000000000081526020015060016000509080519060200190620000bb92919062000181565b506004600260006101000a81548160ff021916908360ff16021790555063053995e0600260016101000a81548163ffffffff021916908363ffffffff160217905550680100000000000000006003600050819090905550600760005033908060018154018082558091505060019003906000526020600020900160005b9091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b6200023c565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620001c457805160ff1916838001178555620001fa565b82800160010185558215620001fa579182015b82811115620001f95782518260005090905591602001919060010190620001d7565b5b5090506200020991906200020d565b5090565b62000239919062000219565b8082111562000235576000818150600090555060010162000219565b5090565b90565b6113f0806200024c6000396000f3fe60806040523480156100115760006000fd5b506004361061013c5760003560e01c806395d89b41116100b9578063bf17b4de1161007d578063bf17b4de146105fa578063c71de71114610618578063ca6d56dc14610642578063d05c78da1461069f578063dd62ed3e146106ec578063e6cb9013146107655761013c565b806395d89b4114610418578063a230c5241461049c578063a293d1e8146104f9578063a9059cbb14610546578063b5931f7c146105ad5761013c565b80633ba0b9a9116101005780633ba0b9a9146102f65780635daf08ca146103145780635e11544b1461038357806366c784b7146103a157806370a08231146103bf5761013c565b806306fdde0314610142578063095ea7b3146101c657806318160ddd1461022d57806323b872dd1461024b578063313ce567146102d25761013c565b60006000fd5b61014a6107b2565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561018b5780820151818401525b60208101905061016f565b50505050905090810190601f1680156101b85780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610213600480360360408110156101dd5760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610853565b604051808215151515815260200191505060405180910390f35b6102356108f0565b6040518082815260200191505060405180910390f35b6102b8600480360360608110156102625760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061094a565b604051808215151515815260200191505060405180910390f35b6102da610bbc565b604051808260ff1660ff16815260200191505060405180910390f35b6102fe610bcf565b6040518082815260200191505060405180910390f35b6103416004803603602081101561032b5760006000fd5b8101908080359060200190929190505050610be1565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61038b610c26565b6040518082815260200191505060405180910390f35b6103a9610e5a565b6040518082815260200191505060405180910390f35b610402600480360360208110156103d65760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610e63565b6040518082815260200191505060405180910390f35b610420610eb7565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104615780820151818401525b602081019050610445565b50505050905090810190601f16801561048e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6104df600480360360208110156104b35760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610f58565b604051808215151515815260200191505060405180910390f35b610530600480360360408110156105105760006000fd5b810190808035906020019092919080359060200190929190505050611012565b6040518082815260200191505060405180910390f35b6105936004803603604081101561055d5760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611032565b604051808215151515815260200191505060405180910390f35b6105e4600480360360408110156105c45760006000fd5b810190808035906020019092919080359060200190929190505050611183565b6040518082815260200191505060405180910390f35b6106026111ac565b6040518082815260200191505060405180910390f35b6106206111b5565b604051808263ffffffff1663ffffffff16815260200191505060405180910390f35b610685600480360360208110156106595760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506111cb565b604051808215151515815260200191505060405180910390f35b6106d6600480360360408110156106b65760006000fd5b8101908080359060200190929190803590602001909291905050506112d0565b6040518082815260200191505060405180910390f35b61074f600480360360408110156107035760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611305565b6040518082815260200191505060405180910390f35b61079c6004803603604081101561077c5760006000fd5b81019080803590602001909291908035906020019092919050505061139a565b6040518082815260200191505060405180910390f35b60006000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561084b5780601f106108205761010080835404028352916020019161084b565b820191906000526020600020905b81548152906001019060200180831161082e57829003601f168201915b505050505081565b600081600660005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819090905550600190506108ea565b92915050565b600060056000506000600073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054600360005054039050610947565b90565b60006109a1600560005060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548361101263ffffffff16565b600560005060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819090905550610a81600660005060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548361101263ffffffff16565b600660005060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819090905550610b61600560005060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548361139a63ffffffff16565b600560005060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081909090555060019050610bb5565b9392505050565b600260009054906101000a900460ff1681565b60006004600050549050610bde565b90565b600760005081815481101515610bf357fe5b906000526020600020900160005b9150909054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006000610c50610c4360036000505460326112d063ffffffff16565b603161118363ffffffff16565b90506000610c698260036000505461101263ffffffff16565b9050600060076000508054905090506000610c8a838361118363ffffffff16565b90506000610cad84610ca284866112d063ffffffff16565b61101263ffffffff16565b90506000600090505b83811015610d5e578260056000506000600760005084815481101515610cd857fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190909055505b8080600101915050610cb6565b50806005600050600060076000506000815481101515610d7a57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819090905550610e2984610e1e600260019054906101000a900463ffffffff1663ffffffff16866112d063ffffffff16565b61118363ffffffff16565b600460005081909090555084600360005081909090555060046000505495505050505050610e575650505050505b90565b60036000505481565b6000600560005060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610eb2565b919050565b60016000508054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610f505780601f10610f2557610100808354040283529160200191610f50565b820191906000526020600020905b815481529060010190602001808311610f3357829003601f168201915b505050505081565b6000600060076000508054905090506000600090505b81811015611001578373ffffffffffffffffffffffffffffffffffffffff16600760005082815481101515610f9f57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610ff35760019250505061100d565b5b8080600101915050610f6e565b50600091505061100d56505b919050565b60008282111515156110245760006000fd5b818303905080505b92915050565b6000611089600560005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548361101263ffffffff16565b600560005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819090905550611129600560005060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548361139a63ffffffff16565b600560005060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508190909055506001905061117d565b92915050565b60006000821115156111955760006000fd5b81838115156111a057fe5b04905080505b92915050565b60046000505481565b600260019054906101000a900463ffffffff1681565b6000600015156111e083610f5863ffffffff16565b151514151561125a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f54686520616464726573732068617320616c726561647920616464656400000081526020015060200191505060405180910390fd5b600760005082908060018154018082558091505060019003906000526020600020900160005b9091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600190506112cb565b919050565b60008183029050805060008314806112f257508183828115156112ef57fe5b04145b15156112fe5760006000fd5b5b92915050565b6000600660005060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050611394565b92915050565b6000818301905080508281101515156113b35760006000fd5b5b9291505056fea26469706673582212205b2239de4291b6136fffbd84ae3dc89213c02d12c916de3f1a841e9b8459c87e64736f6c63430006000033',
    'hex',
)

export const CONTRACT_ABI = `
  [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"_exchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalPopletsSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newMember","type":"address"}],"name":"addMember","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"remaining","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"basicIncome","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"exchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"member","type":"address"}],"name":"isMember","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"members","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"newPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"a","type":"uint256"},{"internalType":"uint256","name":"b","type":"uint256"}],"name":"safeAdd","outputs":[{"internalType":"uint256","name":"c","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"a","type":"uint256"},{"internalType":"uint256","name":"b","type":"uint256"}],"name":"safeDiv","outputs":[{"internalType":"uint256","name":"c","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"a","type":"uint256"},{"internalType":"uint256","name":"b","type":"uint256"}],"name":"safeMul","outputs":[{"internalType":"uint256","name":"c","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"a","type":"uint256"},{"internalType":"uint256","name":"b","type":"uint256"}],"name":"safeSub","outputs":[{"internalType":"uint256","name":"c","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`