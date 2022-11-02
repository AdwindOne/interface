import { appSelect } from 'src/app/hooks'
import {
  Account,
  AccountType,
  BackupType,
  SignerMnemonicAccount,
} from 'src/features/wallet/accounts/types'
import { selectAccounts } from 'src/features/wallet/selectors'
import {
  editAccount as editInStore,
  removeAccount as removeInStore,
} from 'src/features/wallet/walletSlice'
import { disconnectWCForAccount } from 'src/features/walletConnect/WalletConnect'
import { unique } from 'src/utils/array'
import { logger } from 'src/utils/logger'
import { createMonitoredSaga } from 'src/utils/saga'
import { all, call, put } from 'typed-redux-saga'

export enum EditAccountAction {
  AddBackupMethod = 'AddBackupMethod',
  RemoveBackupMethod = 'RemoveBackupMethod',
  Rename = 'Rename',
  Remove = 'Remove',
  TogglePushNotification = 'TogglePushNotification',
  ToggleTestnetSettings = 'ToggleTestnetSettings',
  ToggleShowSmallBalances = 'ToggleShowSmallBalances',
  ToggleShowSpamTokens = 'ToggleShowSpamTokenss',
  // May need a reorder action here eventually
}
interface EditParamsBase {
  type: EditAccountAction
  address: Address
}
interface RenameParams extends EditParamsBase {
  type: EditAccountAction.Rename
  newName: string
}
interface RemoveParams extends EditParamsBase {
  type: EditAccountAction.Remove
  notificationsEnabled: boolean
}

interface AddBackupMethodParams extends EditParamsBase {
  type: EditAccountAction.AddBackupMethod
  backupMethod: BackupType
}

interface RemoveBackupMethodParams extends EditParamsBase {
  type: EditAccountAction.RemoveBackupMethod
  backupMethod: BackupType
}

export interface TogglePushNotificationParams extends EditParamsBase {
  type: EditAccountAction.TogglePushNotification
  enabled: boolean
}

export interface ToggleTestnetSettingsParams extends EditParamsBase {
  type: EditAccountAction.ToggleTestnetSettings
  enabled: boolean
}

export interface ToggleShowSmallBalancesParams extends EditParamsBase {
  type: EditAccountAction.ToggleShowSmallBalances
  enabled: boolean
}

export interface ToggleShowSpamTokensParams extends EditParamsBase {
  type: EditAccountAction.ToggleShowSpamTokens
  enabled: boolean
}

export type EditAccountParams =
  | AddBackupMethodParams
  | RemoveBackupMethodParams
  | RenameParams
  | RemoveParams
  | TogglePushNotificationParams
  | ToggleTestnetSettingsParams
  | ToggleShowSmallBalancesParams
  | ToggleShowSpamTokensParams

function* editAccount(params: EditAccountParams) {
  const { type, address } = params

  const accounts = yield* appSelect(selectAccounts)
  const account = accounts[address]

  if (!account) throw new Error(`No account found for ${address}`)

  switch (type) {
    case EditAccountAction.Rename:
      yield* call(renameAccount, params, account)
      break
    case EditAccountAction.Remove:
      yield* call(removeAccount, params)
      break
    case EditAccountAction.AddBackupMethod:
      yield* call(addBackupMethod, params, account)
      break
    case EditAccountAction.RemoveBackupMethod:
      yield* call(removeBackupMethod, params, account)
      break
    case EditAccountAction.ToggleShowSmallBalances:
      yield* call(toggleShowSmallBalances, params, account)
      break
    case EditAccountAction.ToggleShowSpamTokens:
      yield* call(toggleShowSpamTokens, params, account)
      break
    default:
      break
  }

  logger.info('editAccountSaga', 'editAccount', 'Account updated:', address)
}

function* renameAccount(params: RenameParams, account: Account) {
  const { address, newName } = params
  logger.info('editAccountSaga', 'renameAccount', 'Renaming account', address, 'to ', newName)
  yield* put(
    editInStore({
      address,
      updatedAccount: {
        ...account,
        name: newName,
      },
    })
  )
}

function* removeAccount(params: RemoveParams) {
  const { address } = params
  logger.info('editAccountSaga', 'removeAccount', 'Removing account', address)
  // TODO cleanup account artifacts in native-land (i.e. keystore)
  yield* put(removeInStore(address))
  yield* call(disconnectWCForAccount, address)
}

// Adds the backup to all accounts that share the same seed phrase
function* addBackupMethod(params: AddBackupMethodParams, account: Account) {
  if (account.type !== AccountType.SignerMnemonic) return

  const { backupMethod } = params

  const accounts = yield* appSelect(selectAccounts)
  const mnemonicAccounts = Object.values(accounts).filter(
    (a) =>
      a.type === AccountType.SignerMnemonic &&
      a.mnemonicId === (account as SignerMnemonicAccount).mnemonicId
  )

  const updatedBackups: BackupType[] = unique([...(account.backups ?? []), backupMethod])
  yield* all(
    mnemonicAccounts.map((mnemonicAccount: Account) => {
      return put(
        editInStore({
          address: mnemonicAccount.address,
          updatedAccount: {
            ...mnemonicAccount,
            backups: updatedBackups,
          },
        })
      )
    })
  )

  logger.info(
    'editAccountSaga',
    'addBackupMethod',
    'Adding backup method',
    mnemonicAccounts.map((a) => a.address)
  )
}

// Removes the backup method from all accounts that share the same seed phrase
function* removeBackupMethod(params: RemoveBackupMethodParams, account: Account) {
  if (account.type !== AccountType.SignerMnemonic) return

  const { backupMethod } = params

  const accounts = yield* appSelect(selectAccounts)
  const mnemonicAccounts = Object.values(accounts).filter(
    (a) =>
      a.type === AccountType.SignerMnemonic &&
      a.mnemonicId === (account as SignerMnemonicAccount).mnemonicId
  )

  const updatedBackups = account.backups?.filter((backup) => backup !== backupMethod)

  yield* all(
    mnemonicAccounts.map((mnemonicAccount) => {
      return put(
        editInStore({
          address: mnemonicAccount.address,
          updatedAccount: {
            ...mnemonicAccount,
            backups: updatedBackups,
          },
        })
      )
    })
  )

  logger.info(
    'editAccountSaga',
    'removeBackupMethod',
    'Removing backup method',
    mnemonicAccounts.map((a) => a.address)
  )
}

function* toggleShowSmallBalances(params: ToggleShowSmallBalancesParams, account: Account) {
  const { address, enabled } = params
  logger.info('editAccountSaga', 'toggleShowSmallBalances', address, 'to', enabled)
  yield* put(
    editInStore({
      address,
      updatedAccount: {
        ...account,
        showSmallBalances: enabled,
      },
    })
  )
}

function* toggleShowSpamTokens(params: ToggleShowSpamTokensParams, account: Account) {
  const { address, enabled } = params
  logger.info('editAccountSaga', 'toggleShowSpamTokens', address, 'to', enabled)
  yield* put(
    editInStore({
      address,
      updatedAccount: {
        ...account,
        showSpamTokens: enabled,
      },
    })
  )
}

export const {
  name: editAccountSagaName,
  wrappedSaga: editAccountSaga,
  reducer: editAccountReducer,
  actions: editAccountActions,
} = createMonitoredSaga<EditAccountParams>(editAccount, 'editAccount')
