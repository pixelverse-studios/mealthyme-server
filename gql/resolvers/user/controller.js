import BaseResolver from '../../baseResolver.js'
import User from '../../../models/User.js'
import { Command, Topic, logError, logInfo } from '../../../utils/logger.js'
import { TIERS_MAP } from '../../../utils/user/tiers.js'

class UserController extends BaseResolver {
  constructor() {
    super()
    this.typenames = {
      single: 'User',
      multi: 'Users'
    }
  }

  catchError(action, { topic, operation }, error) {
    logError(topic, operation, error)
    return this.catchError(action)
  }
  async getAll(ctx) {
    const allUsers = await User.find()
    if (allUsers?.length == 0) {
      this.error = this.errors.userNotFound()
      return this.handleError(
        Topic.User,
        ctx.operation,
        `No users found on the system`
      )
    }
    return this.handleMultiItemSuccess(allUsers)
  }
  async getByEmail({ email }, ctx) {
    const user = await User.findOne({ email })
    if (user == null) {
      this.error = this.errors.userNotFound()
      return this.handleError(
        Topic.User,
        ctx.operation,
        `User ${email} not found`
      )
    }
    return this.handleSingleItemSuccess(user)
  }
  async signIn({ email, fullName, avatar, providerId }, ctx) {
    if (!email) {
      this.error = this.errors.userNotFound()
      return this.handleError(
        Topic.User,
        ctx.operation,
        `No email provided for signin`
      )
    }

    const user = await User.findOne({ email })
    if (user !== null) {
      user.lastLogin = Date.now()
      user.newUser = false
      user.avatar = avatar
      const saved = await user.save()
      return this.handleSingleItemSuccess(saved)
    } else {
      logInfo(
        Topic.User,
        ctx.operation,
        `${Command.Register} ${email} from ${providerId}`
      )
      const [firstName, lastName] = fullName?.split(' ') ?? ['', '']
      const newUser = new User({
        email,
        firstName,
        lastName,
        avatar,
        providerId,
        lastLogin: Date.now(),
        newUser: true,
        tier: TIERS_MAP.get(1)
      })
      const saved = await newUser.save()
      return this.handleSingleItemSuccess(saved)
    }
  }
  async delete(email, ctx) {
    const user = await User.find({ email })
    if (!user) {
      this.error = this.errors.userNotFound()
      return this.handleError(
        Topic.User,
        ctx.operation,
        `User ${email} not found`
      )
    }
    logInfo(Topic.User, ctx.operation, `${Command.Delete} User ${email}`)
    const res = await User.findOneAndDelete({ email })
    return this.handleSingleItemSuccess(res)
  }
}

export default UserController
