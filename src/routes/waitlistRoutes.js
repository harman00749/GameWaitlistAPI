import { Router } from 'express'
import {
  createEntry,
  deleteEntry,
  getEntryById,
  getWaitlist,
  updateEntry,
} from '../controllers/waitlistController.js'

const router = Router()

router.get('/', getWaitlist)
router.get('/:id', getEntryById)
router.post('/', createEntry)
router.put('/:id', updateEntry)
router.delete('/:id', deleteEntry)

export default router
