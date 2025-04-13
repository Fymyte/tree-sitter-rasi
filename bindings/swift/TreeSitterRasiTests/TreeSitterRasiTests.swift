import XCTest
import SwiftTreeSitter
import TreeSitterRasi

final class TreeSitterRasiTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_rasi())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Rasi grammar")
    }
}
