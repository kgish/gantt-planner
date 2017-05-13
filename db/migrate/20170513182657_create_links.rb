class CreateLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :links do |t|
      t.integer :source
      t.integer :target
      t.integer :_type
    end
  end
end
