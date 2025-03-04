import { asyncHandler } from './../utils/asynchandler.js'
export const isAuthorized = (role) => {
    return asyncHandler(async (req, res, next) => {
        //check auth
        if (role !== req.user.role)
            return next(new Error("you are not authorized!"),
                { cause: 403 })
        return next()
    }

    )
}