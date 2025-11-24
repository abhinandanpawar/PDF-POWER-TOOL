# Blockers

## Critical
1. **Missing `cad-convert`:** The module is excluded from the build, meaning CAD conversion features are unavailable.

## Major
1. **Test Coverage:** Very low test coverage on both backend and frontend.
2. **Security:** File validation is implemented but needs to be robust (file types, size limits are configured but need verification).
3. **Incomplete Frontend Refactor:** Only core features (Merge, Split) and shared components have been fully verified with the new UI. Other features might need manual verification.

## Minor
1. **Error Handling:** Backend returns 500 for most errors; needs a global exception handler for better client feedback.
2. **Documentation:** API documentation (OpenAPI) is available but needs verification.
