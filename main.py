#!/usr/bin/env python3
"""
Japanese Learning Tool
A comprehensive tool for learning Japanese vocabulary and basic conversation.
No API keys required - all data is stored locally.
"""

import json
import random
import os
from pathlib import Path

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent.resolve()

def load_json(filename):
    """Load a JSON file from the script directory."""
    filepath = SCRIPT_DIR / filename
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header(title):
    """Print a formatted header."""
    print("\n" + "=" * 50)
    print(f"  {title}")
    print("=" * 50 + "\n")

def print_divider():
    """Print a visual divider."""
    print("-" * 50)

class JapaneseLearningTool:
    def __init__(self):
        self.vocabulary = load_json('vocabulary.json')
        self.conversations = load_json('conversations.json')
        self.score = {'correct': 0, 'total': 0}
    
    def main_menu(self):
        """Display the main menu and handle user selection."""
        while True:
            clear_screen()
            print_header("日本語学習ツール - Japanese Learning Tool")
            print("  1. Browse Vocabulary (単語を見る)")
            print("  2. Flashcard Quiz (フラッシュカード)")
            print("  3. Conversation Practice (会話練習)")
            print("  4. Dictionary Search (辞書検索)")
            print("  5. View Statistics (統計)")
            print("  6. Exit (終了)")
            print()
            
            choice = input("Select an option (1-6): ").strip()
            
            if choice == '1':
                self.browse_vocabulary()
            elif choice == '2':
                self.flashcard_quiz()
            elif choice == '3':
                self.conversation_practice()
            elif choice == '4':
                self.dictionary_search()
            elif choice == '5':
                self.view_statistics()
            elif choice == '6':
                print("\nさようなら！(Goodbye!) Keep studying! 頑張って！")
                break
            else:
                input("Invalid option. Press Enter to continue...")
    
    def browse_vocabulary(self):
        """Browse vocabulary by category."""
        while True:
            clear_screen()
            print_header("Browse Vocabulary - 単語を見る")
            
            categories = list(self.vocabulary.keys())
            for i, category in enumerate(categories, 1):
                # Format category name nicely
                display_name = category.replace('_', ' ').title()
                count = len(self.vocabulary[category])
                print(f"  {i}. {display_name} ({count} words)")
            
            print(f"\n  0. Back to Main Menu")
            print()
            
            choice = input("Select a category: ").strip()
            
            if choice == '0':
                break
            
            try:
                idx = int(choice) - 1
                if 0 <= idx < len(categories):
                    self.show_category(categories[idx])
            except ValueError:
                input("Invalid option. Press Enter to continue...")
    
    def show_category(self, category):
        """Display all words in a category."""
        clear_screen()
        display_name = category.replace('_', ' ').title()
        print_header(f"{display_name}")
        
        words = self.vocabulary[category]
        for i, word in enumerate(words, 1):
            print(f"{i:2}. {word['kanji']}")
            print(f"    Romaji:  {word['romaji']}")
            print(f"    English: {word['english']}")
            print()
        
        input("Press Enter to go back...")
    
    def flashcard_quiz(self):
        """Run a flashcard quiz session."""
        while True:
            clear_screen()
            print_header("Flashcard Quiz - フラッシュカード")
            print("  1. Japanese → English")
            print("  2. English → Japanese")
            print("  3. Romaji → Japanese/English")
            print("  4. Select Category")
            print("  0. Back to Main Menu")
            print()
            
            choice = input("Select quiz type: ").strip()
            
            if choice == '0':
                break
            elif choice in ['1', '2', '3']:
                self.run_quiz(int(choice))
            elif choice == '4':
                self.category_quiz()
            else:
                input("Invalid option. Press Enter to continue...")
    
    def get_all_words(self):
        """Get all words from all categories."""
        all_words = []
        for category, words in self.vocabulary.items():
            for word in words:
                word_copy = word.copy()
                word_copy['category'] = category
                all_words.append(word_copy)
        return all_words
    
    def run_quiz(self, quiz_type, words=None, num_questions=10):
        """Run a quiz session."""
        if words is None:
            words = self.get_all_words()
        
        if len(words) < 4:
            input("Not enough words for a quiz. Press Enter to continue...")
            return
        
        num_questions = min(num_questions, len(words))
        quiz_words = random.sample(words, num_questions)
        correct = 0
        
        clear_screen()
        print_header("Quiz Time! - クイズ")
        print(f"Answer {num_questions} questions. Type 'quit' to exit early.\n")
        
        for i, word in enumerate(quiz_words, 1):
            print_divider()
            print(f"Question {i}/{num_questions}")
            print()
            
            if quiz_type == 1:  # Japanese → English
                print(f"What does this mean?")
                print(f"\n  {word['kanji']}  ({word['romaji']})\n")
                answer = word['english'].lower()
                prompt = "Your answer (English): "
            elif quiz_type == 2:  # English → Japanese
                print(f"How do you say this in Japanese?")
                print(f"\n  {word['english']}\n")
                answer = word['romaji'].lower()
                prompt = "Your answer (Romaji): "
            else:  # Romaji → Japanese/English
                print(f"What is the kanji and meaning?")
                print(f"\n  {word['romaji']}\n")
                print(f"(Type the kanji or English meaning)")
                answer = word['english'].lower()
                prompt = "Your answer: "
            
            user_answer = input(prompt).strip().lower()
            
            if user_answer == 'quit':
                break
            
            # Check answer (flexible matching)
            is_correct = self.check_answer(user_answer, word, quiz_type)
            
            if is_correct:
                print("\n✓ 正解！(Correct!)")
                correct += 1
            else:
                print(f"\n✗ 残念！(Incorrect)")
                print(f"  Kanji:   {word['kanji']}")
                print(f"  Romaji:  {word['romaji']}")
                print(f"  English: {word['english']}")
            
            self.score['total'] += 1
            if is_correct:
                self.score['correct'] += 1
            
            input("\nPress Enter to continue...")
            clear_screen()
            print_header("Quiz Time! - クイズ")
        
        # Show results
        print_divider()
        print(f"\nQuiz Complete! 終了！")
        print(f"Score: {correct}/{num_questions} ({correct/num_questions*100:.0f}%)")
        
        if correct == num_questions:
            print("\n完璧！(Perfect!) すごい！")
        elif correct >= num_questions * 0.8:
            print("\nGreat job! よくできました！")
        elif correct >= num_questions * 0.6:
            print("\nGood effort! 頑張りました！")
        else:
            print("\nKeep practicing! 練習を続けましょう！")
        
        input("\nPress Enter to continue...")
    
    def check_answer(self, user_answer, word, quiz_type):
        """Check if the user's answer is correct (with flexible matching)."""
        user_answer = user_answer.lower().strip()
        
        # Check against all possible correct answers
        correct_answers = [
            word['english'].lower(),
            word['romaji'].lower(),
            word['kanji']
        ]
        
        # Also check partial matches for English (e.g., "hello" matches "hello / good afternoon")
        english_parts = [part.strip().lower() for part in word['english'].split('/')]
        correct_answers.extend(english_parts)
        
        # Check romaji variations (e.g., "yon" or "shi" for 4)
        romaji_parts = [part.strip().lower() for part in word['romaji'].split('/')]
        correct_answers.extend(romaji_parts)
        
        return user_answer in correct_answers
    
    def category_quiz(self):
        """Run a quiz on a specific category."""
        clear_screen()
        print_header("Select Quiz Category")
        
        categories = list(self.vocabulary.keys())
        for i, category in enumerate(categories, 1):
            display_name = category.replace('_', ' ').title()
            print(f"  {i}. {display_name}")
        
        print(f"\n  0. Back")
        print()
        
        choice = input("Select a category: ").strip()
        
        if choice == '0':
            return
        
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(categories):
                category = categories[idx]
                words = []
                for word in self.vocabulary[category]:
                    word_copy = word.copy()
                    word_copy['category'] = category
                    words.append(word_copy)
                
                print("\nQuiz type:")
                print("  1. Japanese → English")
                print("  2. English → Japanese")
                quiz_type = input("Select (1 or 2): ").strip()
                
                if quiz_type in ['1', '2']:
                    self.run_quiz(int(quiz_type), words, min(10, len(words)))
        except ValueError:
            pass
    
    def conversation_practice(self):
        """Practice basic Japanese conversation."""
        clear_screen()
        print_header("Conversation Practice - 会話練習")
        print("Practice conversational Japanese!")
        print("Type messages in English, Romaji, or Japanese.")
        print("The system will respond with appropriate phrases.")
        print("\nType 'quit' or 'exit' to return to the menu.")
        print("Type 'help' to see conversation tips.")
        print_divider()
        print()
        
        # Initial greeting
        print("日本語ヘルパー: こんにちは！日本語を練習しましょう！")
        print("               (Konnichiwa! Nihongo wo renshuu shimashou!)")
        print("               Hello! Let's practice Japanese!")
        print()
        
        while True:
            user_input = input("You: ").strip()
            
            if not user_input:
                continue
            
            if user_input.lower() in ['quit', 'exit', 'bye', 'goodbye']:
                print("\n日本語ヘルパー: さようなら！また会いましょう！")
                print("               (Sayounara! Mata aimashou!)")
                print("               Goodbye! Let's meet again!")
                input("\nPress Enter to continue...")
                break
            
            if user_input.lower() == 'help':
                self.show_conversation_help()
                continue
            
            response = self.get_conversation_response(user_input)
            print(f"\n日本語ヘルパー: {response['japanese']}")
            print(f"               ({response['romaji']})")
            print(f"               {response['english']}")
            print()
    
    def get_conversation_response(self, user_input):
        """Get an appropriate response based on user input."""
        user_input_lower = user_input.lower()
        
        # Check each pattern for matching triggers
        for pattern in self.conversations['patterns']:
            for trigger in pattern['triggers']:
                if trigger.lower() in user_input_lower:
                    return random.choice(pattern['responses'])
        
        # Return a default response if no pattern matches
        return random.choice(self.conversations['default_responses'])
    
    def show_conversation_help(self):
        """Show conversation tips and example phrases."""
        print("\n" + "-" * 40)
        print("Conversation Tips:")
        print("-" * 40)
        print("\nTry saying things like:")
        print("  - Hello / Konnichiwa / こんにちは")
        print("  - Good morning / Ohayou")
        print("  - How are you? / Genki?")
        print("  - Thank you / Arigatou")
        print("  - I like Japanese / Nihongo suki")
        print("  - This is difficult / Muzukashii")
        print("  - I'm tired / Tsukareta")
        print("  - Good night / Oyasumi")
        print("-" * 40 + "\n")
    
    def dictionary_search(self):
        """Search the vocabulary dictionary."""
        clear_screen()
        print_header("Dictionary Search - 辞書検索")
        print("Search for words in English, Romaji, or Japanese.")
        print("Type 'quit' to return to the menu.")
        print_divider()
        print()
        
        while True:
            query = input("Search: ").strip()
            
            if not query:
                continue
            
            if query.lower() == 'quit':
                break
            
            results = self.search_vocabulary(query)
            
            if results:
                print(f"\nFound {len(results)} result(s):\n")
                for result in results:
                    print(f"  {result['kanji']}")
                    print(f"    Romaji:   {result['romaji']}")
                    print(f"    English:  {result['english']}")
                    print(f"    Category: {result['category'].replace('_', ' ').title()}")
                    print()
            else:
                print("\nNo results found. Try a different search term.\n")
    
    def search_vocabulary(self, query):
        """Search vocabulary for matching words."""
        query_lower = query.lower()
        results = []
        
        for category, words in self.vocabulary.items():
            for word in words:
                # Search in all fields
                if (query_lower in word['kanji'].lower() or
                    query_lower in word['romaji'].lower() or
                    query_lower in word['english'].lower() or
                    query == word['kanji']):
                    
                    result = word.copy()
                    result['category'] = category
                    results.append(result)
        
        return results
    
    def view_statistics(self):
        """View quiz statistics."""
        clear_screen()
        print_header("Statistics - 統計")
        
        print(f"  Total Questions Answered: {self.score['total']}")
        print(f"  Correct Answers: {self.score['correct']}")
        
        if self.score['total'] > 0:
            percentage = self.score['correct'] / self.score['total'] * 100
            print(f"  Accuracy: {percentage:.1f}%")
            
            if percentage >= 90:
                print("\n  すごい！(Amazing!) You're doing great!")
            elif percentage >= 70:
                print("\n  よくできました！(Well done!) Keep it up!")
            elif percentage >= 50:
                print("\n  頑張って！(Keep trying!) Practice makes perfect!")
            else:
                print("\n  練習を続けましょう！(Let's keep practicing!)")
        else:
            print("\n  No quizzes taken yet. Try a flashcard quiz!")
        
        print("\n" + "-" * 40)
        print("\nVocabulary Statistics:")
        total_words = 0
        for category, words in self.vocabulary.items():
            display_name = category.replace('_', ' ').title()
            count = len(words)
            total_words += count
            print(f"  {display_name}: {count} words")
        print(f"\n  Total: {total_words} words available")
        
        input("\nPress Enter to continue...")


def main():
    """Main entry point."""
    try:
        tool = JapaneseLearningTool()
        tool.main_menu()
    except FileNotFoundError as e:
        print(f"Error: Could not find required data files.")
        print(f"Make sure vocabulary.json and conversations.json are in the same directory.")
        print(f"Details: {e}")
    except KeyboardInterrupt:
        print("\n\nさようなら！(Goodbye!)")


if __name__ == "__main__":
    main()
