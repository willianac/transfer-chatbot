export type LoginResponse = {
	_declaration: {
		_attributes: {
			version: string
			encoding: string
		}
	}
	responsestring: {
		StatusCode: {
			_text: string
		}
		LinkInfo: {
			SessionKey: {
				_text: string
			}
			BaseUnit: {
				_text: string
			}
			SendUnit: {
				_text: string
			}
			MaxOrderAmount: {
				_text: string
			}
			MaxAmountDaily: {
				_text: string
			}
			Rate: {
				_text: string
			}
			ExchPerc: {
				_text: string
			}
			ServiceFee: {
				_text: string
			}
			BranchNo: {
				_text: string
			}
			SenderId: {
				_text: string
			}
			ListLandUnit: {
				_text: string
			}
			ListSendUnit: {
				_text: string
			}
			BaseToPrintRate: {
				_text: string
			}
			SenderDaySum: {
				_text: string
			}
		}
		PayoutOptions: {
			BankDep: {
				_text: string
			},
			CashPay: {
				_text: string
			}
		}
		MoneySender: {
			SenderFirstName: {
				_text: string
			}
			SenderLastName: {
				_text: string
			}
		}
		PurposeOfTransfer: {
			Purpose: {
				PurposeId: {
					_text: string
				}
				PurposeNamePT: {
					_text: string
				}
				PurposeNameUS: {
					_text: string
				}
				PurposeNameES: {
					_text: string
				}
			}[]
		}
		MoneyReceivers: {
			Receiver: {
				ReceiverID: {
					_text: string
				}
				ReceiverName: {
					_text: string
				}
				ReceiverCountryCode: {
					_text: string
				}
				ReceiverKinshipId: {
					_text: string
				}
			}[]
			ReceiverBank: {
				ReceiverId: {
					_text: string
				}
				AcctId: {
					_text: string
				}
				BankNo: {
					_text: string
				}
				BankName: {
					_text: string
				}
				BankBranch: {
					_text: string
				}
				AccountNo: {
					_text: string
				}
			}[]
		}
	}
}