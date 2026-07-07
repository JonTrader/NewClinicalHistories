import { useCallback, useEffect, useRef, useState } from 'react'
import { Search, LoaderIcon } from 'lucide-react'
import { useDebounce } from '../hooks/useDebounce.js'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'

const SEARCH_DELAY = 300
const MIN_QUERY_LENGTH = 2

export function PatientSearchDropdown({ onSelect }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const debouncedQuery = useDebounce(searchQuery, SEARCH_DELAY)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const abortControllerRef = useRef(null)

  const trimmedQuery = searchQuery.trim()
  const hasEnoughChars = trimmedQuery.length >= MIN_QUERY_LENGTH

  useEffect(() => {
    const query = debouncedQuery.trim()
    if (query.length < MIN_QUERY_LENGTH) return

    const controller = new AbortController()
    abortControllerRef.current = controller

    async function fetchResults() {
      setIsSearchLoading(true)
      try {
        const res = await ax.get('/api/v1/patients/search', {
          params: { q: query },
          signal: controller.signal,
        })
        if (controller.signal.aborted) return
        setSearchResults(res.data)
        setActiveIndex(res.data.length > 0 ? 0 : -1)
      } catch (error) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') return
        console.error('Error in patient search: ', error)
        toast.error(error.response?.data?.message || 'Problema al buscar pacientes')
        setSearchResults([])
        setActiveIndex(-1)
      } finally {
        if (!controller.signal.aborted) {
          setIsSearchLoading(false)
        }
      }
    }

    fetchResults()
    return () => controller.abort()
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = useCallback((id) => {
    setShowDropdown(false)
    setSearchQuery('')
    setSearchResults([])
    setActiveIndex(-1)
    onSelect(id)
  }, [onSelect])

  const handleKeyDown = useCallback((e) => {
    if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab'].includes(e.key)) {
      return
    }

    if (e.key === 'Tab') {
      setShowDropdown(false)
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      setShowDropdown(false)
      inputRef.current?.blur()
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      if (showDropdown && searchResults.length > 0) {
        const index = activeIndex >= 0 ? activeIndex : 0
        handleSelect(searchResults[index]._id)
      }
      return
    }

    if (!hasEnoughChars) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!showDropdown) {
        setShowDropdown(true)
        setActiveIndex(0)
        return
      }
      setActiveIndex((prev) =>
        prev >= searchResults.length - 1 ? 0 : prev + 1
      )
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!showDropdown) {
        setShowDropdown(true)
        setActiveIndex(searchResults.length - 1)
        return
      }
      setActiveIndex((prev) =>
        prev <= 0 ? searchResults.length - 1 : prev - 1
      )
    }
  }, [showDropdown, searchResults, activeIndex, hasEnoughChars, handleSelect])

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value.trim().length >= MIN_QUERY_LENGTH) {
      setShowDropdown(true)
    } else if (value.trim().length === 0) {
      setShowDropdown(false)
    }
  }

  const handleFocus = () => {
    if (hasEnoughChars) {
      setShowDropdown(true)
    }
  }

  return (
    <div
      className="relative"
      ref={dropdownRef}
      role="combobox"
      aria-expanded={showDropdown}
      aria-haspopup="listbox"
      aria-controls="search-results-list"
    >
      <label className="flex items-center gap-2 w-full sm:w-56 bg-blueDeep text-lightBone border border-blueSteel rounded-md px-3 py-2 focus-within:border-blueSky focus-within:ring-1 focus-within:ring-blueSky transition-colors duration-150">
        <Search className="w-4 h-4 text-lightOcre shrink-0" />
        <input
          ref={inputRef}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          type="search"
          className="grow bg-transparent text-sm font-body placeholder:text-blueSky/50 focus:outline-none"
          placeholder="Buscar paciente..."
          value={searchQuery}
          autoComplete="off"
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `search-option-${activeIndex}` : undefined
          }
        />
      </label>
      {showDropdown && (
        <ul
          id="search-results-list"
          role="listbox"
          className="absolute z-50 mt-2 w-full min-w-[16rem] bg-blueDeep rounded-lg shadow-xl border border-blueSteel max-h-60 overflow-y-auto font-body"
        >
          {!hasEnoughChars ? (
            <li className="px-3 py-2 text-sm text-lightOcre/70 text-center">
              Escribe al menos {MIN_QUERY_LENGTH} caracteres
            </li>
          ) : isSearchLoading ? (
            <li className="flex justify-center py-3" role="option">
              <LoaderIcon className="w-5 h-5 animate-spin text-lightOcre" />
            </li>
          ) : searchResults.length > 0 ? (
            searchResults.map((patient, index) => (
              <li
                key={patient._id}
                id={`search-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
              >
                <button
                  type="button"
                  className={`w-full px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                    index === activeIndex ? 'bg-blueSteel text-lightBone' : 'text-lightBone hover:bg-blueSteel'
                  }`}
                  onClick={() => handleSelect(patient._id)}
                >
                  <span className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </span>
                  <span className="ml-2 text-lightOcre text-xs font-mono">
                    {patient?.idType || ''} {patient?.idNumber || ''}
                  </span>
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-lightOcre/70 text-center" role="option">
              Sin resultados
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
