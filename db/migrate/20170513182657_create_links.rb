class CreateLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :links do |t|
      t.integer :source
      t.integer :target
      t.integer :code
    end
  end
end
