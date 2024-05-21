package tree_sitter_rasi_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-rasi"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_rasi.Language())
	if language == nil {
		t.Errorf("Error loading Rasi grammar")
	}
}
